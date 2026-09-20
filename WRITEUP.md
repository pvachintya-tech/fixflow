# FixFlow — Hackathon Writeup

## One-line pitch

**FixFlow turns many messy campus complaints into a smaller number of actionable, explainable real-world incidents.**

## Problem

Campus complaint systems commonly treat every submission as a separate ticket. In practice, many submissions describe the same underlying problem using different words.

For example:

- "No water in the library."
- "The library drinking water is not working."
- "Students cannot use the drinking water facility in the library."

These can represent one real-world incident, but a traditional ticketing system may keep them as separate records.

This creates noise for administrators and makes it harder to understand the true scale and urgency of a problem.

## What we built

FixFlow introduces a distinction between a **complaint** and an **incident**.

A complaint is an individual report.

An incident is the underlying real-world issue that one or more reports may refer to.

When a complaint is submitted, FixFlow uses Amazon Bedrock to understand it, validates important campus information, generates a semantic embedding, retrieves related complaints, and then applies an **Incident Fusion** process to decide whether the new report belongs to an existing incident or should create a new one.

## Our key innovation: Incident Fusion

The important design choice is that FixFlow does **not** merge complaints using text similarity alone.

The fusion decision considers:

- semantic similarity
- location
- category
- time
- impact
- available report/evidence context

This prevents false merges such as two similar complaints coming from different buildings or two different issue categories occurring in the same building.

It also allows multiple independent reports to contribute to the understanding of the same incident.

## AWS architecture

The deployed system uses:

**Amazon Bedrock Nova Micro** for structured complaint understanding.

**Amazon Bedrock Titan Text Embeddings V2** for semantic embeddings.

**Amazon OpenSearch Serverless** for vector retrieval of similar complaints.

**Amazon DynamoDB** as the application source of truth for complaints and incidents.

**AWS Lambda + API Gateway** for serverless application logic and APIs.

**Amazon Cognito** for student and admin authentication.

**Amazon S3** for evidence storage.

**Amazon EventBridge** for SLA/escalation scheduling.

**AWS SAM / CloudFormation** for infrastructure deployment.

**AWS Amplify** for the live frontend.

## End-to-end flow

```text
Complaint
   ↓
API Gateway
   ↓
Lambda
   ├── Nova Micro → structured meaning
   ├── Campus Registry → location validation
   ├── Titan Embeddings → semantic vector
   └── OpenSearch → similar reports
                 ↓
          Incident Fusion
       similarity + context
                 ↓
       Same incident / New incident
                 ↓
              DynamoDB
                 ↓
        Student/Admin dashboard
```

## Why this approach matters

The goal is not simply to classify complaints.

The goal is to turn many individual reports into a more useful operational view of the problems happening on campus.

For administrators, this creates a clearer path from:

**many reports → related reports → one incident → severity/impact → action → resolution**

The system also keeps uncertainty explicit. AI confidence is treated as confidence in the system's matching/analysis rather than proof that an allegation is true.

## Demo

Live student dashboard:

https://production.d1fgofpjkpwn4x.amplifyapp.com/

Admin dashboard:

https://production.d1fgofpjkpwn4x.amplifyapp.com/admin

Source code:

https://github.com/pvachintya-tech/fixflow

## Demo Login Credentials

### Student
- Username: `demo-student`
- Password: `FixflowDemo10`

### Admin
- Username: `demo-admin`
- Password: `DemoAdmin10`

## Demo Video

[Watch the FixFlow Demo on YouTube](https://youtu.be/PAEE_yZ_JRs)

## AI coding disclosure

AI coding assistants were used during development for code drafting, debugging, iteration, and implementation support. The team reviewed, tested, integrated, and validated the resulting code and AWS deployment.

## Final outcome

FixFlow demonstrates a serverless AWS application where generative AI and vector search are used for a concrete operational problem: transforming noisy campus complaints into a smaller set of actionable incidents while preserving contextual checks and uncertainty.
