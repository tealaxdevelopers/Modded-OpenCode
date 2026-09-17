# Enterprise

Using OpenCode securely in your organization.

OpenCode Enterprise is for organizations that want to ensure that their code and data never leaves their infrastructure. It can do this by using a centralized config that integrates with your SSO and internal AI gateway.

> OpenCode does not store any of your code or context data.

To get started with OpenCode Enterprise:

1. Do a trial internally with your team.
2. Contact us to discuss pricing and implementation options.

---

## Trial

OpenCode is open source and does not store any of your code or context data, so your developers can simply get started and carry out a trial.

### Data handling

**OpenCode does not store your code or context data.** All processing happens locally or through direct API calls to your AI provider.

This means that as long as you are using a provider you trust, or an internal AI gateway, you can use OpenCode securely.

The only caveat here is the optional `/share` feature.

#### Sharing conversations

If a user enables the `/share` feature, the conversation and the data associated with it are sent to the service we use to host these share pages at opencode.ai.

We recommend you disable this for your trial:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "share": "disabled"
}
```

### Code ownership

**You own all code produced by OpenCode.** There are no licensing restrictions or ownership claims.

---

## Pricing

We use a per-seat model for OpenCode Enterprise. If you have your own LLM gateway, we do not charge for tokens used.

---

## Deployment

Once you have completed your trial and you are ready to use OpenCode at your organization, contact us to discuss pricing and implementation options.

### Central Config

We can set up OpenCode to use a single central config for your entire organization. This centralized config can integrate with your SSO provider and ensures all users access only your internal AI gateway.

### SSO integration

Through the central config, OpenCode can integrate with your organization's SSO provider for authentication. This allows OpenCode to obtain credentials for your internal AI gateway through your existing identity management system.

### Internal AI gateway

With the central config, OpenCode can also be configured to use only your internal AI gateway. You can also disable all other AI providers, ensuring all requests go through your organization's approved infrastructure.

### Self-hosting

While we recommend disabling the share pages to ensure your data never leaves your organization, we can also help you self-host them on your infrastructure. This is currently on our roadmap.

---

## FAQ

**What is OpenCode Enterprise?**

OpenCode Enterprise is for organizations that want to ensure that their code and data never leaves their infrastructure.

**How do I get started?**

Simply start with an internal trial with your team. Then contact us to discuss pricing and implementation options.

**How does enterprise pricing work?**

We offer per-seat enterprise pricing. If you have your own LLM gateway, we do not charge for tokens used.

**Is my data secure?**

Yes. OpenCode does not store your code or context data. All processing happens locally or through direct API calls to your AI provider.

**Can we use our own private NPM registry?**

OpenCode supports private npm registries through Bun's native `.npmrc` file support. Set up authentication before running OpenCode:

```bash
npm login --registry=https://your-company.jfrog.io/api/npm/npm-virtual/
```
