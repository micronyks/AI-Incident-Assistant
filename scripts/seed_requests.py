import random

from uuid_utils import uuid4

from app.database.session import SessionLocal
from app.models.request import Request
from app.domain.enums import (
    RequestCategory,
    RequestPriority,
    RequestStatus,
)

db = SessionLocal()

# Clean existing data
db.query(Request).delete()
db.commit()

hardware = [
    ("Laptop blue screen", "Laptop crashes with blue screen after 30 minutes."),
    ("Laptop overheating", "Laptop becomes very hot while working."),
    ("Battery not charging", "Battery remains at 0%."),
    ("Keyboard not working", "Several keys stopped responding."),
    ("Mouse disconnecting", "USB mouse disconnects frequently."),
    ("Monitor flickering", "External monitor flickers every few seconds."),
    ("Docking station issue", "Dock not detecting monitors."),
    ("Printer offline", "Printer always shows offline."),
    ("Scanner not detected", "Scanner not visible in Windows."),
    ("SSD failure", "Laptop fails to boot due to SSD.")
]

software = [
    ("Outlook crashing", "Outlook closes immediately after launch."),
    ("Teams not opening", "Microsoft Teams stuck on loading."),
    ("Excel crashing", "Excel crashes when opening files."),
    ("Adobe activation", "Adobe Acrobat license activation failed."),
    ("Chrome freezing", "Chrome freezes after startup."),
    ("VSCode crashing", "VSCode exits unexpectedly."),
    ("Slack notifications", "Slack notifications not received."),
    ("Zoom camera issue", "Camera not detected in Zoom."),
    ("Git authentication", "Unable to authenticate with Git."),
    ("Jenkins build failed", "CI pipeline failing after latest commit.")
]

network = [
    ("VPN not connecting", "Unable to connect after password reset."),
    ("VPN disconnecting", "VPN disconnects every 10 minutes."),
    ("Internet slow", "Office internet is very slow."),
    ("DNS failure", "Unable to resolve internal hostname."),
    ("Proxy error", "Proxy authentication failed."),
    ("Firewall blocked", "Firewall blocking application."),
    ("Remote desktop issue", "RDP disconnects frequently."),
    ("Load balancer timeout", "Requests timing out."),
    ("WiFi unstable", "Frequent WiFi disconnections."),
    ("API Gateway unreachable", "Gateway returns 502.")
]

access = [
    ("Password reset", "Forgot Windows password."),
    ("MFA failure", "OTP not received."),
    ("Account locked", "Active Directory account locked."),
    ("Shared drive access", "Permission denied."),
    ("GitHub access", "Need GitHub repository access."),
    ("AWS IAM access", "Request IAM permissions."),
    ("Jira access", "Need Jira project access."),
    ("Confluence access", "Unable to access wiki."),
    ("VPN access", "Request VPN access."),
    ("Database access", "Need read-only DB access.")
]

feature = [
    ("Dual monitor request", "Need second monitor."),
    ("Adobe license request", "Need Adobe Acrobat."),
    ("VSCode installation", "Install VSCode."),
    ("Increase mailbox size", "Mailbox quota exceeded."),
    ("New VM request", "Need development VM."),
    ("RAM upgrade", "Upgrade RAM to 32GB."),
    ("Docker installation", "Need Docker Desktop."),
    ("AWS Sandbox", "Need AWS sandbox account."),
    ("Kubernetes namespace", "Create namespace."),
    ("API rate increase", "Increase API rate limit.")
]

security = [
    ("MFA failure", "OTP not received."),
    ("Suspicious login", "Unknown login detected."),
    ("Firewall blocked", "Firewall blocked outgoing traffic."),
    ("SSL certificate expired", "Certificate expired."),
    ("Unauthorized access", "User accessed restricted area."),
]

all_data = [
    (hardware, RequestCategory.HARDWARE, "Hardware Support"),
    (software, RequestCategory.SOFTWARE, "Desktop Support"),
    (network, RequestCategory.SOFTWARE, "Network Operations"),
    (access, RequestCategory.ACCESS, "Identity & Access Team"),
    (feature, RequestCategory.FEATURE, "Service Desk"),
    (security, RequestCategory.SECURITY, "Security Operations")
]

priorities = [
    RequestPriority.P1,
    RequestPriority.P2,
    RequestPriority.P3,
    RequestPriority.P4,
]

statuses = [
    RequestStatus.SUBMITTED,
    RequestStatus.IN_PROGRESS,
    RequestStatus.WAITING_FOR_APPROVAL,
    RequestStatus.RESOLVED,
    RequestStatus.CLOSED,
]

resolutions = [
    "Restarted affected service.",
    "Updated device drivers.",
    "Reinstalled application.",
    "Reset user credentials.",
    "Replaced faulty hardware.",
    "Applied latest patches.",
    "Updated configuration.",
    "Restarted workstation.",
    "Resolved after policy synchronization.",
    "Escalated and resolved by specialist team."
]

records = []

for _ in range(200):

    dataset, category, team = random.choice(all_data)

    title, description = random.choice(dataset)

    priority = random.choices(
        priorities,
        weights=[10, 40, 35, 15],
        k=1,
    )[0]

    status = random.choice(statuses)

    records.append(
        Request(
            title=title,
            description=description,
            category=category,
            priority=priority,
            status=status,
            id=str(uuid4()),
            resolution_summary=random.choice(resolutions),
            assigned_team=team,
        )
    )

db.add_all(records)
db.commit()

print(f"Inserted {len(records)} requests.")

db.close()