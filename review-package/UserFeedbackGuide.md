# User Onboarding & Feedback Guide

This guide details the onboarding workflow and the feedback collection mechanics built into FundForge.

## User Onboarding Flow
To ensure that new users can use the platform effectively, we built a step-by-step **Welcome Guide** modal:
1. **Step 0: Welcome**: Details the decentralized crowdfunding concept.
2. **Step 1: Wallet Connection**: Guides users to install and connect a Stellar wallet.
3. **Step 2: Explore Campaigns**: Explains how to browse active and completed campaigns.
4. **Step 3: Create Campaign**: Guides users on setting goals and deploying escrow accounts.
5. **Step 4: Support Campaign**: Outlines the refund guarantee and how to send XLM.

---

## Feedback Collection System

To satisfy Level 4 requirements, FundForge integrates Google Forms and Sheets:

### 1. Google Form for Surveys
* **Env Config**: `VITE_GOOGLE_FORM_URL`
* **Default URL**: `https://forms.gle/fundforge_level4_feedback_mock`
* **Purpose**: Collects detailed user surveys, usability ratings, and feature requests.

### 2. Google Sheet for Public Responses
* **Env Config**: `VITE_GOOGLE_SHEET_URL`
* **Default URL**: `https://docs.google.com/spreadsheets/d/fundforge_level4_responses_mock`
* **Purpose**: Displays the responses from active testers in a public spreadsheet.

### 3. Local Feedback Evidence
For testing and quick audit convenience, users can submit feedback directly on the **Feedback Page** (`/feedback`). This saves real feedback items in browser storage to serve as local reviewer evidence.
