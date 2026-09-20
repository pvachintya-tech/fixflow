from datetime import datetime, timezone, timedelta
import os
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["INCIDENTS_TABLE_NAME"])

SLA_HOURS = {
    "CRITICAL": 1,
    "HIGH": 4,
    "MEDIUM": 12,
    "LOW": 24,
}


def lambda_handler(event, context):
    response = table.scan()
    incidents = response.get("Items", [])

    now = datetime.now(timezone.utc)
    escalated = []

    for incident in incidents:
        status = incident.get("status", "UNCONFIRMED")

        if status == "RESOLVED":
            continue

        severity = incident.get("severity", "LOW")
        sla_hours = SLA_HOURS.get(severity, 24)

        created_at = incident.get("createdAt")
        if not created_at:
            continue

        try:
            created_time = datetime.fromisoformat(
                created_at.replace("Z", "+00:00")
            )
        except ValueError:
            continue

        if now - created_time >= timedelta(hours=sla_hours):
            if incident.get("escalated") is True:
                continue

            table.update_item(
                Key={"incidentId": incident["incidentId"]},
                UpdateExpression="SET escalated = :e, escalatedAt = :t",
                ExpressionAttributeValues={
                    ":e": True,
                    ":t": now.isoformat(),
                },
            )

            escalated.append(incident["incidentId"])

    return {
        "statusCode": 200,
        "checked": len(incidents),
        "escalated": escalated,
    }
