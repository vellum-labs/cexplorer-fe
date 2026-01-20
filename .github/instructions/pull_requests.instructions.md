---
applyTo: pull_requests
---

When reviewing code, focus on:

- you are building best cardano explorer on the world - cexplorer.io - so we need quality and awesome solutions.

## Security Critical Issues
- Check for hardcoded secrets, API keys, or credentials
- Look for SQL injection and XSS vulnerabilities
- Verify proper input validation and sanitization
- Review authentication and authorization logic
- Check if are used professional coding practices

## Performance Red Flags
- Identify N+1 database query problems
- Spot inefficient loops and algorithmic issues
- Check for memory leaks and resource cleanup
- Review caching opportunities for expensive operations

## Code Quality Essentials
- Functions should be focused and appropriately sized
- Use clear, descriptive naming conventions
- Ensure proper error handling throughout

## Review Style
- Be specific and actionable in feedback
- Acknowledge good patterns when you see them
- Ask clarifying questions when code intent is unclear
- Keep your review as concise as possible. Compare the original with the new version, evaluating the context, of course, but mainly the proposed change.
- List the flaws that need to be corrected, mention things that are unprofessional, incorrectly programmed, potential errors, and shortcomings.
- Leave out the fluff, just the essentials, no long essays.
- Finally, evaluate the PR and the quality of the developer's work in PR.

Always suggest changes to improve readability. For example, this suggestion seeks to make the code more readable and also makes the validation logic reusable and testable.

// Instead of:
if (user.email && user.email.includes('@') && user.email.length > 5) {
  submitButton.enabled = true;
} else {
  submitButton.enabled = false;
}

// Consider:
function isValidEmail(email) {
  return email && email.includes('@') && email.length > 5;
}

submitButton.enabled = isValidEmail(user.email);
