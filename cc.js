const target = JSON.parse($response.body);
// 将所有为 false 的值改为 true
for (let key in target) {
  if (target[key] === false) {
    target[key] = true;
  }
}
// 将 "free" 改为 "pro"
if (target.membershipType === "free") {
  target.membershipType = "pro";
}
if (target.individualMembershipType === "free") {
  target.individualMembershipType = "pro";
}
if (target.teamMembershipType === "free") {
  target.teamMembershipType = "pro";
}
// 将数值 7 改为 365
if (typeof target.trialLengthDays === 'number' && target.trialLengthDays === 7) {
  target.trialLengthDays = 365;
}
$done({ body: JSON.stringify(target) });

