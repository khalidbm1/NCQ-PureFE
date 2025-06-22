# 🔧 NCQ Platform Technical Implementation

## Bin Packing
Regardless of your resource isolation model, it's important to consider when and how your solution will scale out across multiple resources. You might need to scale your resources as the load on your system increases, or as the number of tenants grows. Consider bin packing to deploy an optimal number of resources for your requirements.

**Tip**: In many solutions, it's easier to scale your entire set of resources together, instead of scaling resources individually. Consider following the Deployment Stamps pattern.

### Resource Limits
Resources have limits and quotas that must be considered in your solution planning. For example, resources might support a maximum number of concurrent requests or tenant-specific configuration settings.

The way you configure and use each resource also affects the scalability of that resource. For example, suppose that, given a certain amount of compute resources, your application can successfully respond to a defined number of transactions per second. Beyond this point, you might need to scale out. Performance testing helps you to identify the point at which your resources no longer meet your requirements.

**Note**: The principle of scaling to multiple resources applies even when you work with services that support multiple instances.

For example, App Service supports scaling out the number of instances of your plan, but there are limits for how far you can scale a single plan. In a high-scale multitenant app, you might exceed these limits and need to deploy more App Service plans to match your growth.

When you share some of your resources between tenants, you should first determine the number of tenants that the resource supports, when it's configured according to your requirements. Then, deploy as many resources as you need to serve your total number of tenants.

For example, suppose you deploy Application Gateway as part of a multitenant SaaS solution. You review your application design, test the application gateway's performance under load, and review its configuration. Then, you determine that a single application gateway resource can be shared among 100 customers. According to your organization's growth plan, you expect to onboard 150 customers in your first year, so you need to plan to deploy multiple application gateways to service your expected load.

In the previous diagram, there are two application gateways. The first gateway is dedicated to customers 1 through 100, and the second is dedicated to customers 101 through 200.

### Resource Group and Subscription Limits
Whether you work with shared or dedicated resources, it's important to account for limits. limits the number of resources that can be deployed into a resource group and into an subscription. As you approach these limits, you need to plan to scale across multiple resource groups or subscriptions.

For example, suppose you deploy a dedicated application gateway, for each of your customers, into a shared resource group. For some resources, supports deploying up to 800 resources of the same type into a single resource group. So, when you reach this limit, you need to deploy any new application gateways into another resource group. In the following diagram, there are two resource groups. Each resource group contains 800 application gateways.

### Bin Pack Tenants Across Resource Groups and Subscriptions
You can also apply the bin packing concept across resources, resource groups, and subscriptions. For example, when you have a small number of tenants you might be able to deploy a single resource and share it among all of your tenants. The following diagram shows bin packing into a single resource.

As you grow, you might approach the capacity limit for a single resource, and scale out to multiple (R) resources. The following diagram shows bin packing across multiple resources.

Over time, you might reach the limit of the number of resources in a single resource group, and you would then deploy multiple (R) resources into multiple (G) resource groups. The following diagram shows bin packing across multiple resources, in multiple resource groups.

And as you grow even larger, you can deploy across multiple (S) subscriptions, each containing multiple (G) resource groups with multiple (R) resources. The following diagram shows bin packing across multiple resources, in multiple resource groups and subscriptions.

By planning your scale-out strategy, you can scale to extremely large numbers of tenants and sustain a high level of load.

### Tags
Resource tags enable you to add custom metadata to your resources, which can be useful for management and tracking costs. For more details, see Allocate costs by using resource tags.

### Deployment Stacks
Deployment stacks enable you to group resources together based on a common lifetime, even if they span multiple resource groups or subscriptions. Deployment stacks are useful when you deploy tenant-specific resources, especially if you have a deployment approach that requires deploying different types of resources into different places because of scale or compliance concerns. Deployment stacks also enable you to easily remove all of the resources related to a single tenant in one operation, if that tenant is offboarded. For more information, see Deployment stacks.

### Antipatterns to Avoid
- **Not planning for scale**: Ensure you have a clear understanding of the limits of the resources you'll deploy, and which limits might become important, as your load or number of tenants increase. Plan how you'll deploy additional resources as you scale, and test the plan.
- **Not planning to bin pack**: Even if you don't need to grow immediately, plan to scale your resources across multiple resources, resource groups, and subscriptions over time. Avoid making assumptions in your application code, like there being a single resource when you might need to scale to multiple resources in the future.
- **Scaling many individual resources**: If you have a complex resource topology, it can become difficult to scale each component individually. It's often simpler to scale your solution as a unit, by following the Deployment Stamps pattern.
- **Deploying isolated resources for each tenant, when not required**: In many solutions, it's more cost effective and efficient to deploy shared resources for multiple tenants.
- **Failing to track tenant-specific resources**: If you deploy tenant-specific resources, ensure you understand which resources are allocated to which tenants. This information is important for compliance purposes, for tracking costs, and for deprovisioning resources if a tenant is offboarded. Consider using resource tags to keep track of tenant information on resources, and consider using deployment stacks to group tenant-specific resources together into a logical unit regardless of the resource group or subscription they're in.
- **Using separate NCQ Entra tenants**: In general, it's inadvisable to provision multiple NCQ Entra tenants. Managing resources across NCQ Entra tenants is complex. It's simpler to scale across subscriptions linked to a single NCQ Entra tenant.
- **Overarchitecting when you don't need to scale**: In some solutions, you know with certainty that you'll never grow beyond a certain level of scale. In these scenarios, there's no need to build complex scaling logic. However, if your organization plans to grow, then you will need to be prepared to scale—potentially at short notice.

---

## Application Identity

Application identity is a critical area for SaaS workloads because it serves as the first line of defense for protecting data. It's often overlooked until late in a project, but many decisions about other elements of the application depend on a solid identity strategy. Don't underestimate the importance of identity in helping to protect your customers' data.

In the context of SaaS workloads, there are two distinct types of identity.

**Application identity**, also known as customer identity and access management (CIAM), enables end users to authenticate and use your SaaS application. There are two main methods for signing users in to an application identity provider:

- **Federated identities**: Users sign in with existing credentials that are maintained by another identity provider. That provider could be a social identity provider such as Google, Facebook, or LinkedIn, or an enterprise identity provider that your customers use, such as Microsoft Entra or Okta. Maintenance of the user's account is the responsibility of the federated identity provider.

- **Local identities**: Users create an account just for your application. The account is secured by username and password, passkey, or other authentication methods. Maintenance of the user's account is your responsibility.

**Enterprise identity** is the identity solution that's used to authenticate internal users and workloads to business productivity tools, internal tools or services, and Azure services. You use an enterprise identity solution for your internal users and workloads to authenticate them to business productivity tools, internal tools or services, and Azure services.

Application and enterprise identities serve different purposes and might use different identity providers. This article focuses on design considerations for application identity, though both types are likely to be present in your SaaS workload environment.

Identity management involves two related concerns: authentication (verifying a user's identity) and authorization (granting permissions based on identity). The first three sections of this article focus on authentication for SaaS. The final section addresses authorization considerations for SaaS providers.

### Identity in a Multitenant Application
Keeping tenant data separate in a multitenant application is critical. That segmentation is driven by your choice of effective user authentication and authorization. Also, the choice of tenancy model significantly influences your decisions about the identity provider. Prioritize identity as your primary perimeter.

Refer to SE:04 Recommendations for segmentation.

#### Design Considerations
- Understand the tenancy and deployment models for your application. There might be nuances that influence your identity strategy. For example, it's a misconception that the Deployment Stamps pattern requires an identity provider in each stamp. For most identity providers, you can often use an alternative isolation model.

- When you choose your identity provider for multitenancy, evaluate the impact of failures. Misconfigurations can potentially bring down your entire application for all tenants. Weigh the overhead costs against the risk of the potential radius of impact.

- If you deploy your solution into a customer's Azure environment and manage it on their behalf, you might need to integrate with their enterprise identity provider. Have a clear understanding of these aspects:
  - The types of users and their access needs when they interact with your application tenants. For example, User A might only need access to sign in to tenant 1, but user B might need access to sign in to both tenant 1 and tenant 2.
  - Compliance with data residency regulations, if they're applicable to your identity provider. In some cases, data that's stored by an identity provider might be subject to regulations. Many identity providers provide specific guidance and capabilities for this scenario. Assess whether this scenario is relevant to you and take necessary steps to ensure compliance.

#### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Follow your identity provider's best practices and guidelines for partitioning the solution for multiple tenants. | Tenant isolation helps you to achieve your security and compliance goals. |
| Avoid having multiple accounts for the same user. A user should have a single account with one set of credentials, even if they need access to multiple tenants. Grant access to each tenant as needed rather than creating multiple accounts for the same user. | Creating multiple accounts for the same user increases security risks and can confuse users who need to remember multiple usernames and passwords for the same software. |
| When you consider data residency, plan how to store user data in separate locations. If you deploy a separate deployment stamp for your users in other geographies, you might also need separate identity providers. Make sure you have a way to identify where users' data is stored so you can direct them to the correct region for sign-in, if you need to. | You'll be able to support your compliance requirements and enhance the user experience by routing users to the sign-in experience that's appropriate for their location. |

### Identity Provider Selection
Each identity provider offers unique features, limitations, pricing models, and implementation patterns. Microsoft Entra and Okta are popular identity as a service (IDaaS) options. There are also other open source providers, such as Keycloak and Authentik.

#### Design Considerations
Document your identity requirements. Start by listing the features that your application needs now and will need in the future. Typical features to consider include:

- Federated identity provider support to integrate with customers' identity solutions. This feature enables you to avoid creating new identities.
- Customizable sign-in/sign-up flow to modify the look and feel to maintain your branding. This feature also provides the ability to inject custom business logic into the sign-in/sign-up process.
- Separation of tenant data into distinct silos to maintain tenant isolation.
- Audit support to retain or export sign-in logs for security management.

**Important**: Consider your planned user growth when you evaluate the cost of an identity solution. A solution might not remain cost effective or scalable in the long term, but it could be useful for now. Have a migration plan that you can use if the need arises.

For example, a solution might be affordable for 500 users but unsustainable for 5 million. If it requires minimal setup and is user-friendly and easy to migrate from, it could still be the right choice until scaling costs justify switching to a different solution.

Research the identity provider capabilities thoroughly. Make sure the identity solution matches your list of required features. Even if you don't currently need complex scenarios like federated identity, consider future needs. For business-to-business (B2B) SaaS solutions, federated identity will probably be necessary eventually.

Factor in management overhead. Different identity providers require varying levels of management overhead. Well-known IDaaS solutions usually have less overhead because they handle hosting, maintenance, and security. However, the additional overhead of an open source solution might be worthwhile if the solution is a better fit for your specialized needs.

#### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Don't create your own identity solution. Identity is a highly specialized area, and creating an identity solution is complex and expensive. It's difficult to create an identity solution that's secure and reliable. | You'll avoid the antipattern of creating your own provider and enhance the security, reliability, and operational efficiency of your solution. |
| Create a capability matrix of the features offered by identity providers and map it against your identity requirements. | You'll ensure your ability to evolve without being constrained by a limited set of identity features. |
| Prefer IDaaS options over open source solutions. Hosting an open source solution yourself incurs significant operational overhead and security risks. However, you might choose that option to meet specific requirements for compliance, data residency, or reliability that a provider can't fulfill. For more information, see IDaaS identity providers. | By using an IDaaS identity provider, you'll avoid unnecessary complexity and can focus your efforts on your core business. |

### Federated Identity
Federated identity, also known as single sign-on (SSO), allows users to sign in with credentials they already use elsewhere. You enable federated identity by establishing a trust relationship between your application identity provider and the customer's existing identity provider. Federated identity is a common requirement for SaaS solutions, especially in B2B, because customers prefer their employees to use corporate credentials. It offers several benefits for B2B solutions, such as centralized identity management and automatic lifecycle management. In B2C SaaS products, integrating with social identity providers is common to allow users to sign in with existing credentials.

**Tradeoff**: Complexity and operational efficiency. By working with federated identity providers, you offload the complexity of managing your users' identities. However, you take on the cost of integrating with another identity provider. Decide where you want to focus your operational efforts.

Although implementing federated identity is initially simple, it becomes more complex as the number of supported identity providers increases. Careful planning is essential, especially if each customer uses a unique identity provider. Even if they use the same identity provider, unique trust relationships are often required for each customer because of specific configuration details.

This image shows the relationship between your application, your application identity provider, and the downstream identity providers that you might choose to implement by using identity federation.

Diagram that shows an application trusting a single identity provider, which in turn federates with multiple customer identity providers.

#### Design Considerations
- Estimate the types and number of identity providers you need to support. You might need a static number of social identity providers, or you might need unique federated identity providers for each customer. You should know whether your customers will use OpenID Connect (OIDC), Security Assertion Markup Language (SAML), or both for integration.

- Map out the sign-in experience. Visualize the user flow of the sign-up and sign-in process. Note any special requirements that might alter your user flow design. For example:
  - Custom branding. White labeling or custom sign-in domains per customer.
  - Custom information. Collecting additional user information during sign-up or sign-in, such as tenant selection for users with access to multiple tenants.
  - Identity provider selection. If you use a single application identity provider that has many federated identity providers trusting it, decide how to select a provider. This selection might be done manually via a button or automatically based on known user information. As the number of providers increases, automatic selection becomes more practical. This capability is known as Home Realm Discovery.

#### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Choose an identity provider that can scale to accommodate the number of federated identity providers you need. Be aware of the hard limits of the provider, which can't be exceeded. | You'll ensure that your identity solution can scale as you grow. |
| Plan the onboarding of each federated identity provider and automate the process as much as possible. This collaborative effort between your organization and your customers involves exchanging information to establish a trust relationship, typically via OIDC or SAML protocols. | Identity integration can take time and effort for both you and your customers. By planning the process, you'll improve your operational efficiency. |
| Reflect the complexity and cost of federated identity in your pricing and business model. Allowing customers to use their own identity provider increases operational complexity and costs because of the overhead of maintaining multiple federated identity trust relationships. It's common in SaaS solutions for enterprises to pay for a higher tier that enables federated sign-in. | Federating with a customer's identity provider can be a hidden cost in SaaS solutions. By planning for it, you'll avoid unexpected costs during implementation. |
| Plan for how a user's identity provider will be selected during the sign-in flow. Consider using Home Realm Discovery. Microsoft Entra ID provides built-in Home Realm Discovery. | You'll streamline your customer experience and ensure that users are directed to the right sign-in process. |

### Authorization
User authorization is crucial for SaaS applications, which often store data for multiple tenants. Clearly define how users will be authorized to access only their data without inadvertently accessing other tenants' data. Additionally, provide granular authorization within a tenant, allowing users to read or access certain information while restricting updates or access to other data.

#### Design Considerations
Choose the right authorization model for the use case. There are two main types:

- **Role-based authorization**: Users are assigned roles or groups, and specific features are restricted to certain roles. For example, administrators can perform any action, but users in other roles have limited permissions.
- **Resource-based authorization**: Each resource has its own set of permissions. A user might be an administrator for one resource but have no access to another.

Decide where to store authorization data. Authorization data for your application can be stored in:

- **Your identity provider**: Take advantage of the built-in groups or roles, surfacing permissions as claims in the token issued to your application. Your application can then enforce authorization rules by using these token claims.
- **Your application**: Develop your own authorization logic and store user permissions in a database or similar system, allowing for fine-grained role-based or resource-level authorization controls.

**Tradeoff**: Complexity, flexibility, and security. Storing authorization data in an identity provider and surfacing through token claims is usually simpler than managing your own authorization system. However, claim-based authorization limits your flexibility, and you need to accept that claims are only refreshed when a token is reissued, which can cause a delay in applying changed permissions.

Assess the impact of delegated management. In most SaaS applications, especially in B2B applications, role and permission management is delegated to customers. Without this functionality, you might increase your management overhead if customers frequently change their users' permissions.

Evaluate multitenant access. In some systems, a single user might need to access data from multiple tenants. For example, consultants might need to access data from multiple tenants. Plan how customers will grant access to these users and how your sign-in flow will support selecting and switching among tenants.

#### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Prevent users from accessing data across tenant boundaries unless that access is explicitly permitted. | Unauthorized access to another tenant's data, even accidental access, can be seen as a major security incident and erode customer trust in your platform. Blocking unnecessary access will help you avoid these situations. |
| If the data is static and changes infrequently, store it in the identity provider. If frequent changes are needed while the user is using the software, store the authorization data in your application. | Selecting the best data store for your authorization data will enhance your operational efficiency and help you meet your scalability needs. |
| If you delegate permission management to customers, provide a clear method for them to manage permissions. For instance, create a web portal that's accessible only to tenant administrators for changing user permissions. | You'll provide more control to your customers and avoid unnecessary operational burden on your support team. |