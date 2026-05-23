# Team Execution Phases — EV Dealer Management System

## Table of Contents

1. [Overview](#overview)
2. [Team Members](#team-members)
3. [Phase 1 — Task Creation](#phase-1--task-creation)
4. [Phase 2 — Action-by-Action Fixes](#phase-2--action-by-action-fixes)
5. [Phase 3 — Pipeline Hardening](#phase-3--pipeline-hardening)
6. [Pipeline Flow Diagram](#pipeline-flow-diagram)
7. [Current Pipeline Status](#current-pipeline-status)

---

## Overview

This document describes the three execution phases the team followed (and will follow) to set up a complete CI/CD pipeline with Jira integration for the EV Dealer Management System.

**Repository**: `TranMinhNhut-UTH/Travel---Homestay---Camping---Booking---Application`
**Tech Stack**: .NET 8.0 Microservices, React 18, RabbitMQ, GitHub Actions, Jira Cloud
**CI/CD Option**: Option C — Full CI/CD Pipeline with Jira Sync

---

## Team Members

| Member                   | Git Username                              | Email                        | Role      |
| ------------------------ | ----------------------------------------- | ---------------------------- | --------- |
| Trần Minh Nhứt         | `66TranMinhNhut` / `UTH_TranMinhNhut` | tranminhnhut200125@gmail.com | Team Lead |
| Trần Trình Minh        | `tmtienn`                               | tientrinh050205@gmail.com    | Member    |
| Phạm Trần Quốc Thắng | `qthang201105` / `thang201105`        | ptqthang201105@gmail.com     | Member    |
| Hoàng Lê Đăng        | `HoangLeDang20xx`                       | hoangld1971@ut.edu.vn        | Member    |
| Nguyễn Minh Khang       | —                                        | —                           | Member    |
| Phạm Võ Thành Đạt   | —                                        | —                           | Member    |

---

## Phase 1 — Task Creation

### 1.1 Objective

Automatically create Jira issues for the entire team using a GitHub Actions `workflow_dispatch` workflow, so each member can pick up a task from the Jira board and work independently.

### 1.2 Workflow: `create-jira-issues.yml`

**Location**: `.github/workflows/create-jira-issues.yml`
**Trigger**: Manual dispatch (`workflow_dispatch`)

**Inputs**:

| Input             | Required | Default                                        | Description                   |
| ----------------- | -------- | ---------------------------------------------- | ----------------------------- |
| `epic_key`      | Yes      | —                                             | Jira epic key (e.g.,`ED-1`) |
| `project_key`   | No       | Derived from epic                              | Jira project key              |
| `issue_type`    | No       | `Task`                                       | Issue type for child tasks    |
| `issues_json`   | No       | `''`                                         | Custom JSON array of issues   |
| `template_path` | No       | `.github/jira-templates/default-issues.json` | Template file path            |

**How it works**:

1. Team Lead triggers the workflow from GitHub Actions UI
2. Workflow reads the template file (or custom JSON)
3. Script `create-jira-issues.mjs` calls Jira REST API v2
4. Creates issues under the specified Epic with labels: `automation`, `cicd`, `github-actions`, `jira-import`
5. Each issue appears on the Jira board as "To Do"

### 1.3 Template: `default-issues.json`

The template contains 12 tasks organized into the three phases:

**Phase 1 & 2 Tasks (ED-3 to ED-8)**:

| # | Jira ID | Summary                                  | Description                                                                                    |
| - | ------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1 | ED-3    | Create Jira import workflow for the team | Make the manual workflow_dispatch action create Jira issues under a given epic                 |
| 2 | ED-4    | Validate the Postman collection path     | Confirm the collection lives at the repo root and the workflow points to the correct JSON file |
| 3 | ED-5    | Fix solution restore and build path      | Make GitHub Actions restore and build the correct DealerSystem.sln path                        |
| 4 | ED-6    | Verify Jira In Progress automation       | Ensure a successful push moves the linked Jira issue from To Do to In Progress                 |
| 5 | ED-7    | Verify Jira Done automation after merge  | Ensure a merged pull request moves the linked Jira issue to Done                               |
| 6 | ED-8    | Document the team execution phases       | Describe Phase 1 task creation, Phase 2 action-by-action fixes, and Phase 3 pipeline hardening |

**Phase 3 Tasks (ED-15 to ED-20)**:

| #  | Jira ID | Summary                                    | Description                                                                         |
| -- | ------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| 7  | ED-15   | Run backend unit tests                     | Add and run unit tests for core backend services                                    |
| 8  | ED-16   | Run backend integration tests              | Execute integration tests that exercise multiple services and database interactions |
| 9  | ED-17   | Verify database migrations and seeds       | Ensure Entity Framework migrations apply cleanly and seed data is correct           |
| 10 | ED-18   | Smoke-test key API endpoints               | Quick API smoke tests for auth, vehicle listing, order creation, and customer CRUD  |
| 11 | ED-19   | Verify RabbitMQ message flow and consumers | Confirm events are published and consumed and retry logic works                     |
| 12 | ED-20   | Verify NotificationService end-to-end      | Send test events to ensure Email and SMS flows reach SendGrid/Twilio                |

### 1.4 Supporting Scripts

| Script                     | Location             | Purpose                                                                           |
| -------------------------- | -------------------- | --------------------------------------------------------------------------------- |
| `create-jira-issues.mjs` | `.github/scripts/` | Reads template → calls Jira REST API → creates issues under an Epic             |
| `jira-client.mjs`        | `.github/scripts/` | Shared Jira API client: create issue, add comment, transition issue, extract keys |
| `jira-sync.mjs`          | `.github/scripts/` | Sync CI results → Jira: IN_PROGRESS on push pass, DONE on merge, FAIL comment    |
| `validate-postman.mjs`   | `.github/scripts/` | Validates Postman collection JSON structure (name, items)                         |

### 1.5 How to Use

```bash
# From GitHub Actions UI:
# 1. Go to Actions → "Create Jira Issues" → Run workflow
# 2. Enter epic_key (e.g., ED-2)
# 3. Click "Run workflow"
# 4. Check Jira board for new issues
```

### 1.6 Result

After running the workflow, 12 issues appeared on the Jira board under the specified Epic. Each team member picked one task and created a feature branch following the naming convention: `feature/ED-{number}-{description}`.

---

## Phase 2 — Action-by-Action Fixes

### 2.1 Objective

Each team member picked one task and fixed/verified one specific part of the CI/CD pipeline. The goal was to ensure the full pipeline (build + Jira sync) works correctly end-to-end.

### 2.2 Task Assignment

| Jira ID | Task                                    | Assignee                 | Status         |
| ------- | --------------------------------------- | ------------------------ | -------------- |
| ED-3    | Create Jira import workflow             | Trần Minh Nhứt (Lead)  | ✅ Done        |
| ED-4    | Validate Postman collection path        | Nguyễn Minh Khang       | ✅ Done        |
| ED-5    | Fix solution restore and build path     | Hoàng Lê Đăng        | ✅ Done        |
| ED-6    | Verify Jira In Progress automation      | Trần Trình Minh        | ✅ Done        |
| ED-7    | Verify Jira Done automation after merge | Phạm Trần Quốc Thắng | ✅ Done        |
| ED-8    | Document team execution phases          | Đặt Phạm Vũ Thành   | 🔲 In Progress |

### 2.3 Detailed Timeline (from Git History)

#### ED-1: Initial CI/CD Setup (Lead: Trần Minh Nhứt)

**Branch**: `feature/ED-1-initial-cicd-setup`
**PRs**: #2, #3, #9

| Commit      | Date             | Description                                                                          |
| ----------- | ---------------- | ------------------------------------------------------------------------------------ |
| `c7864dd` | 2026-05-16 15:30 | Initial commit                                                                       |
| `de5935e` | 2026-05-21 22:02 | Change project structure                                                             |
| `a2a222a` | 2026-05-21 22:45 | Add new project structure                                                            |
| `a0b1146` | 2026-05-21 22:48 | Convert submodule to normal folder                                                   |
| `141e7a2` | 2026-05-22 09:17 | Add workflows, scripts, jira-templates                                               |
| `06a6ea3` | 2026-05-22 09:17 | Add Postman collection                                                               |
| `e5c1956` | 2026-05-22 09:21 | ED-1 test GitHub Actions                                                             |
| `8bdadde` | 2026-05-22 09:33 | Fix: move workflows to repository root (`.github/workflows/` must be at repo root) |
| `1e608d1` | 2026-05-22 09:45 | Fix paths for solution and Postman collection                                        |
| `2114246` | 2026-05-22 09:49 | Update ci-jira workflow                                                              |
| `dc9ad16` | 2026-05-22 09:53 | ED-1 setup Jira GitHub Actions pipeline                                              |
| `cd89d2b` | 2026-05-22 10:12 | ED-1 add 6 backend test tasks to template                                            |

**What was done**:

- Created the entire CI/CD infrastructure from scratch
- Set up `ci-jira.yml` workflow with: branch validation, Postman validation, dotnet restore, dotnet build, Jira sync
- Created `create-jira-issues.yml` for automated task creation
- Created all 4 supporting scripts (`jira-client.mjs`, `jira-sync.mjs`, `create-jira-issues.mjs`, `validate-postman.mjs`)
- Created default Jira template with 12 tasks
- Fixed workflow location (must be at `.github/workflows/` in repo root, not inside `ev-dealer-management/`)

---

#### ED-3: Fix Transition Names (Lead: Trần Minh Nhứt)

**Branch**: `feature/ED-3-test-automation-flow`
**PR**: #10

| Commit      | Date             | Description                                        |
| ----------- | ---------------- | -------------------------------------------------- |
| `cf1bfab` | 2026-05-22 22:47 | Test workflow                                      |
| `ad8d2db` | 2026-05-22 22:53 | ED-3 update workflow file to fix transitions names |

**What was done**:

- Changed `JIRA_TRANSITION_IN_PROGRESS` from using a GitHub Secret (`${{ secrets.JIRA_TRANSITION_IN_PROGRESS }}`) to a hardcoded string value `"In Progress"` directly in the workflow file
- This fixed the issue where the secret was empty or not configured, causing the Jira transition to fail silently
- Added the `merge-pr-to-done` job as a separate job (previously it was part of the push job, which meant it couldn't trigger properly on PR merge events)
- Changed `JIRA_TRANSITION_DONE` from secret to hardcoded value `"Done"`
- Changed `GITHUB_REF_NAME` for the merge job from `github.ref_name` to `github.event.pull_request.head.ref` to correctly extract the branch name from the merged PR

---

#### ED-4: Validate Postman Collection Path (Nguyễn Minh Khang)

**Task**: Confirm the Postman collection file exists at the correct path and the CI workflow references it correctly.

**Verification**:

- Postman collection file: `ev-dealer-management.postman_collection.json` (32.5KB) at repo root
- CI workflow references: `./ev-dealer-management.postman_collection.json`
- Validation script (`validate-postman.mjs`) checks: `collection.info.name` exists, `collection.item` is a non-empty array

---

#### ED-5: Fix Solution Restore and Build Path (Hoàng Lê Đăng)

**Branch**: `feature/ED-5-fix-solution-path`

| Commit      | Date             | Description                                |
| ----------- | ---------------- | ------------------------------------------ |
| `07a9002` | 2026-05-23 16:10 | ED-5 temporarily disable Jira comment step |

**What was done**:

- Identified that the Jira comment-on-failure step was causing pipeline errors when Jira secrets were missing or misconfigured
- Temporarily disabled the Jira failure comment step to prevent false pipeline failures
- The solution path itself (`ev-dealer-management/ev-dealer-management/DealerSystem.sln`) was already fixed by Lead in ED-1

**Note**: The Jira comment step needs to be re-enabled after the Jira secrets are properly configured.

---

#### ED-6: Verify Jira In Progress Automation (Trần Trình Minh)

**Branch**: `feature/ED-6-verify-automation`
**PRs**: #8

| Commit      | Date             | Description                                                   |
| ----------- | ---------------- | ------------------------------------------------------------- |
| `1531c4a` | 2026-05-22 22:00 | ED-6: verify Jira automation tracking for progress transition |
| `ae711db` | 2026-05-22 22:25 | ED-6: testing automation on new branch                        |
| `3f8698e` | 2026-05-22 22:54 | ED-6: Test trigger automation from To Do to In Progress       |
| `3c2e718` | 2026-05-22 22:55 | Merge branch 'main' into feature/ED-6-verify-automation       |
| `661e395` | 2026-05-22 23:21 | ED-6: Verify Jira In Progress automation                      |

**What was done**:

- Verified the complete flow: push to feature branch → CI build passes → Jira issue moves from "To Do" to "In Progress"
- Tested with multiple commits to confirm the automation is reliable
- Confirmed that the `jira-sync.mjs IN_PROGRESS` script correctly calls the Jira API transition endpoint
- Verified that the branch name `feature/ED-6-verify-automation` is correctly parsed to extract Jira key `ED-6`

---

#### ED-7: Verify Jira Done Automation After Merge (Phạm Trần Quốc Thắng)

**Branch**: `feature/ED-7-verify-jira-done-automation-after-merge`
**PRs**: #4, #6, #7, #11

| Commit      | Date             | Description                                  |
| ----------- | ---------------- | -------------------------------------------- |
| `94a49e0` | 2026-05-22 20:20 | ED-7 verify Jira done automation             |
| `f5e8eeb` | 2026-05-22 20:32 | ED-7 remove invalid project reference        |
| `2dd3aaf` | 2026-05-22 20:40 | ED-7 restore DealerManagementService project |
| `0b219ea` | 2026-05-22 20:32 | ED-7 remove invalid project reference        |
| `5def962` | 2026-05-22 21:34 | ED-7 fix Jira done transition name           |
| `b36eb45` | 2026-05-23 01:05 | ED-7 Fix Jira DONE transition name           |

**What was done**:

- Verified the merge flow: PR merged to main → Jira issue moves to "DONE"
- Discovered and fixed a critical issue: `DealerManagementService.csproj` had an invalid project reference that caused `dotnet build` to fail. Fixed by removing and restoring the project reference.
- Discovered and fixed a Jira transition name mismatch: the workflow used `Done` (mixed case) but Jira required `DONE` (uppercase). Changed `JIRA_TRANSITION_DONE: Done` → `JIRA_TRANSITION_DONE: DONE` in `ci-jira.yml`
- Required multiple PRs (#4, #6, #7, #11) to iteratively fix all issues

### 2.4 Issues Encountered and Fixes

| # | Issue                                             | Root Cause                                                                                         | Who Fixed                       | Fix Applied                                                              |
| - | ------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| 1 | Workflows not detected by GitHub Actions          | `.github/workflows/` was inside nested folder instead of repo root                               | Trần Minh Nhứt (ED-1)         | Moved workflows to repo root `.github/workflows/`                      |
| 2 | `dotnet restore` failed — cannot find solution | Path was wrong; solution is at `ev-dealer-management/ev-dealer-management/DealerSystem.sln`      | Trần Minh Nhứt (ED-1)         | Updated path in `ci-jira.yml`                                          |
| 3 | Jira In Progress transition failed silently       | `JIRA_TRANSITION_IN_PROGRESS` was configured as a GitHub Secret but the secret was empty/not set | Trần Minh Nhứt (ED-3)         | Hardcoded `"In Progress"` directly in workflow instead of using secret |
| 4 | Jira Done transition failed                       | Transition name mismatch:`Done` vs `DONE` (Jira is case-sensitive for transition names)        | Phạm Trần Quốc Thắng (ED-7) | Changed `JIRA_TRANSITION_DONE: Done` → `JIRA_TRANSITION_DONE: DONE` |
| 5 | `dotnet build` failed on CI                     | `DealerManagementService.csproj` had invalid/broken project references                           | Phạm Trần Quốc Thắng (ED-7) | Removed invalid references, restored project                             |
| 6 | Pipeline failed on Jira comment step              | `jira-sync.mjs FAIL` threw error when Jira secrets were missing                                  | Hoàng Lê Đăng (ED-5)        | Temporarily disabled the Jira failure comment step                       |

### 2.5 Branches Created During Phase 2

| Branch                                                   | Author          | PR #            | Status |
| -------------------------------------------------------- | --------------- | --------------- | ------ |
| `feature/ED-1-initial-cicd-setup`                      | 66TranMinhNhut  | #2, #3, #9      | Merged |
| `feature/ED-3-test-automation-flow`                    | 66TranMinhNhut  | #10             | Merged |
| `feature/ED-5-fix-solution-path`                       | HoangLeDang20xx | —              | Merged |
| `feature/ED-6-verify-automation`                       | tmtienn         | #8              | Merged |
| `feature/ED-7-verify-jira-done-automation-after-merge` | qthang201105    | #4, #6, #7, #11 | Merged |

---

## Phase 3 — Pipeline Hardening

### 3.1 Objective

Upgrade the pipeline from "build-only" to a full quality gate: automated tests → code coverage → API tests → enforcement before merge.

### 3.2 Current State

The pipeline currently only performs:

- ✅ Branch naming validation
- ✅ Postman collection structure validation
- ✅ `dotnet restore`
- ✅ `dotnet build`
- ✅ Jira In Progress transition on push
- ✅ Jira DONE transition on PR merge

**Missing**:

- ❌ `dotnet test` — No test projects exist yet
- ❌ Code coverage collection (Coverlet)
- ❌ Newman API tests
- ❌ Coverage threshold enforcement
- ❌ Jira failure comment (temporarily disabled)

### 3.3 Test Projects to Create

The solution `DealerSystem.sln` currently has 7 service projects and **0 test projects**. The following test projects need to be created:

| Test Project                  | Target Service              | Test Types         | NuGet Packages                                         |
| ----------------------------- | --------------------------- | ------------------ | ------------------------------------------------------ |
| `UserService.Tests`         | UserService (:7001)         | Unit + Integration | xUnit, Moq, Coverlet, Microsoft.AspNetCore.Mvc.Testing |
| `VehicleService.Tests`      | VehicleService (:5068)      | Unit + Integration | xUnit, Moq, Coverlet, Microsoft.AspNetCore.Mvc.Testing |
| `SalesService.Tests`        | SalesService (:5003)        | Unit + Integration | xUnit, Moq, Coverlet, Microsoft.AspNetCore.Mvc.Testing |
| `CustomerService.Tests`     | CustomerService (:5039)     | Unit + Integration | xUnit, Moq, Coverlet, Microsoft.AspNetCore.Mvc.Testing |
| `NotificationService.Tests` | NotificationService (:5051) | Unit               | xUnit, Moq, Coverlet                                   |
| `ReportingService.Tests`    | ReportingService (:5208)    | Unit               | xUnit, Moq, Coverlet                                   |

### 3.4 Testing Techniques (KCPM Requirements)

Each test must be tagged with the technique used:

| Technique                | Abbreviation | When to Use                                      | Example                                                |
| ------------------------ | ------------ | ------------------------------------------------ | ------------------------------------------------------ |
| Equivalence Partitioning | EP           | Divide input domain into equivalent classes      | Valid email vs invalid email vs empty email            |
| Boundary Value Analysis  | BVA          | Test values at boundaries                        | Price = -1, 0, 1, MAX                                  |
| Decision Table           | DT           | Multiple conditions combine to different outputs | Vehicle exists? + In stock? + Valid contact? → Result |

**Naming convention**: `MethodName_Condition_ExpectedResult`

```csharp
[Fact]
[Trait("Category", "EP")]
public void CreateVehicle_ValidInput_ReturnsSuccess() { }

[Theory]
[InlineData(-1)]
[InlineData(0)]
[Trait("Category", "BVA")]
public void CreateVehicle_InvalidPrice_ThrowsException(decimal price) { }

[Fact]
[Trait("Category", "DT")]
public void Reserve_NoStock_And_InvalidCustomer_ReturnsBadRequest() { }
```

### 3.5 CI Pipeline Updates Required

The following steps need to be added to `ci-jira.yml` after the `dotnet build` step:

```yaml
      - name: Run tests with coverage
        run: |
          dotnet test ev-dealer-management/ev-dealer-management/DealerSystem.sln \
            --configuration Release \
            --no-build \
            --collect:"XPlat Code Coverage" \
            --results-directory ./TestResults

      - name: Install Newman
        run: npm install -g newman

      - name: Run Postman/Newman API tests
        run: newman run ./ev-dealer-management.postman_collection.json --bail

      - name: Re-enable Jira failure comment
        if: failure()
        env:
          JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
          JIRA_EMAIL: ${{ secrets.JIRA_EMAIL }}
          JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
          JIRA_ISSUE_KEYS: ${{ steps.jira_keys.outputs.keys }}
          GITHUB_RUN_URL: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
          GITHUB_REF_NAME: ${{ github.ref_name }}
        run: node .github/scripts/jira-sync.mjs FAIL
```

### 3.6 Quality Targets

| Metric         | Target               | Tool                                     |
| -------------- | -------------------- | ---------------------------------------- |
| Test Pass Rate | **100%**       | xUnit via `dotnet test`                |
| Code Coverage  | **100%**       | Coverlet                                 |
| API Test Pass  | **100%**       | Newman + Postman Collection              |
| Build          | **0 warnings** | `dotnet build --configuration Release` |

### 3.7 Remaining Tasks (Jira ED-15 to ED-20)

| Jira ID | Task                                 | Priority | Dependencies               |
| ------- | ------------------------------------ | -------- | -------------------------- |
| ED-15   | Run backend unit tests               | P0       | Create test projects first |
| ED-16   | Run backend integration tests        | P0       | ED-15 completed            |
| ED-17   | Verify database migrations and seeds | P1       | None                       |
| ED-18   | Smoke-test key API endpoints         | P1       | Newman installed           |
| ED-19   | Verify RabbitMQ message flow         | P2       | RabbitMQ running           |
| ED-20   | Verify NotificationService e2e       | P2       | ED-19 completed            |

### 3.8 Known Issues to Resolve

| # | Issue                                                                   | Impact                                              | Action Required                            |
| - | ----------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------ |
| 1 | Jira failure comment step disabled (ED-5)                               | Team doesn't get alerts on CI failure               | Re-enable after Jira secrets are confirmed |
| 2 | `DealerManagementService` is empty                                    | Build warning, no functionality                     | Remove from solution or implement          |
| 3 | `ProcessedReservationsController` commented out                       | Dead code in SalesService                           | Fix build errors or remove                 |
| 4 | SalesService/NotificationService/ReportingService missing Ocelot routes | Cannot access via API Gateway                       | Add routes to `ocelot.json`              |
| 5 | README.md has stale port numbers                                        | VehicleService shows `:5002` instead of `:5068` | Update README                              |

---

## Pipeline Flow Diagram

```
Developer                  GitHub                    Jira
   │                         │                        │
   │  git push               │                        │
   │  feature/ED-xxx-desc    │                        │
   │────────────────────────>│                        │
   │                         │  ci-jira.yml triggers  │
   │                         │                        │
   │                         │  1. Validate branch    │
   │                         │  2. Validate Postman   │
   │                         │  3. dotnet restore     │
   │                         │  4. dotnet build       │
   │                         │  5. dotnet test (P3)   │
   │                         │  6. Newman tests (P3)  │
   │                         │                        │
   │                         │  IF SUCCESS:           │
   │                         │  Extract ED-xxx key    │
   │                         │───────────────────────>│
   │                         │  Transition:           │
   │                         │  To Do → In Progress   │
   │                         │                        │
   │  Create Pull Request    │                        │
   │────────────────────────>│                        │
   │                         │                        │
   │  Lead reviews + merges  │                        │
   │                         │  merge-pr-to-done job  │
   │                         │───────────────────────>│
   │                         │  Transition:           │
   │                         │  In Progress → DONE    │
   │                         │                        │
   │  IF FAILURE:            │                        │
   │                         │  Comment on Jira issue │
   │                         │───────────────────────>│
   │                         │  "CI FAILED" + link    │
```

---

## Current Pipeline Status

### CI Workflow: `ci-jira.yml`

**Job 1: `push-ci-and-in-progress`** (triggers on every push)

| Step                        | Status        | Description                                              |
| --------------------------- | ------------- | -------------------------------------------------------- |
| Checkout                    | ✅ Working    | `actions/checkout@v4`                                  |
| Setup .NET 8                | ✅ Working    | `actions/setup-dotnet@v4`                              |
| Setup Node 20               | ✅ Working    | `actions/setup-node@v4`                                |
| Validate branch naming      | ✅ Working    | Regex:`feature/ED-xxx-desc`, `fix/ED-xxx-desc`, etc. |
| Extract Jira issue keys     | ✅ Working    | Parses branch name + commit message                      |
| Validate Postman collection | ✅ Working    | `validate-postman.mjs`                                 |
| Restore solution            | ✅ Working    | `dotnet restore DealerSystem.sln`                      |
| Build solution              | ✅ Working    | `dotnet build --configuration Release`                 |
| Comment failure to Jira     | ⚠️ Disabled | ED-5 temporarily disabled                                |
| Move to In Progress         | ✅ Working    | `jira-sync.mjs IN_PROGRESS`                            |

**Job 2: `merge-pr-to-done`** (triggers on PR merge)

| Step                      | Status     | Description                       |
| ------------------------- | ---------- | --------------------------------- |
| Checkout                  | ✅ Working | `actions/checkout@v4`           |
| Setup Node 20             | ✅ Working | `actions/setup-node@v4`         |
| Extract Jira keys from PR | ✅ Working | Parses PR head ref + title + body |
| Move to DONE              | ✅ Working | `jira-sync.mjs DONE`            |

---

> **End of Document**
> For questions, contact the team lead or refer to the project's README.md.
