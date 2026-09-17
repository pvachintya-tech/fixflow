import json
import os
import uuid
from datetime import datetime, timezone

import boto3


dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(body)
    }


def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body") or "{}")

        complaint_text = body.get("text", "").strip()
        location = body.get("location", "").strip()
        reporter_id = body.get("reporterId", "DEMO-STUDENT")

        if not complaint_text:
            return response(400, {
                "message": "Complaint text is required"
            })

        complaint_id = f"CMP-{uuid.uuid4().hex[:8].upper()}"
        created_at = datetime.now(timezone.utc).isoformat()

        item = {
            "complaintId": complaint_id,
            "text": complaint_text,
            "location": location,
            "reporterId": reporter_id,
            "status": "RECEIVED",
            "createdAt": created_at
        }

        table.put_item(Item=item)

        return response(201, {
            "complaintId": complaint_id,
            "status": "RECEIVED",
            "createdAt": created_at
        })

    except Exception as exc:
        print(f"Error processing complaint: {exc}")

        return response(500, {
            "message": "Internal server error"
        })
