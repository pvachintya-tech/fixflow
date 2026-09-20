from datetime import datetime, timezone

SIMILARITY_THRESHOLD = 0.50
TIME_WINDOW_HOURS = 24


def _parse_time(value):
    if not value:
        return None

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except Exception:
        return None


def _normalize_location(value):
    if not value:
        return None

    normalized = value.upper().replace("_", " ").replace("-", " ")
    return " ".join(normalized.split())


def decide_fusion(
    new_category,
    new_location,
    new_created_at,
    similar_results
):
    """
    Decide whether a new complaint belongs to an existing incident.

    Similarity alone is never sufficient.
    """

    new_time = _parse_time(new_created_at)

    for result in similar_results:
        score = float(result.get("score", 0))
        source = result.get("source", {})

        existing_category = source.get("category")
        existing_location = source.get("location")
        existing_time = _parse_time(source.get("createdAt"))
        existing_incident_id = source.get("incidentId")

        # Ignore legacy/orphaned complaint vectors that are not linked
        # to an incident. They must not create duplicate incidents.
        if not existing_incident_id:
            continue

        # Semantic similarity must pass.
        if score < SIMILARITY_THRESHOLD:
            continue

        # Category is a hard fusion constraint.
        if new_category:
            if not existing_category:
                continue
            if new_category != existing_category:
                continue

        # Physical location is a hard fusion constraint.
        normalized_new_location = _normalize_location(new_location)
        normalized_existing_location = _normalize_location(existing_location)

        if normalized_new_location:
            if not normalized_existing_location:
                continue
            if normalized_new_location != normalized_existing_location:
                continue

        # Do not merge complaints that are too far apart in time.
        if new_time and existing_time:
            hours_apart = abs(
                (new_time - existing_time).total_seconds()
            ) / 3600

            if hours_apart > TIME_WINDOW_HOURS:
                continue

        return {
            "decision": "SAME_INCIDENT",
            "matchedComplaintId": source.get("complaintId"),
            "similarityScore": score,
            "reason": (
                "High semantic similarity with matching "
                "category, location, and time window."
            )
        }

    return {
        "decision": "NEW_INCIDENT",
        "matchedComplaintId": None,
        "similarityScore": None,
        "reason": "No existing complaint satisfied all fusion rules."
    }
