
# 🧠 Technical Architecture Overview – Unified Multi-Product SaaS Platform

## 🎯 Objective
Design and implement a modular, multi-tenant SaaS platform for showcasing and provisioning technical products including:
- 🔐 General-purpose Blockchain Platform (customizable per client)
- 🌐 IoT System
- 💳 Payment Gateway (used across all products)
- 🧠 LLM-based AI Engine
- 🏢 Smart Building Management (via IoT)

Each product can be licensed independently or used as an integrated service through the unified platform.

---

## 🧱 Core Architectural Principles

### 1. Multi-Tenant SaaS Design
- Logical tenant separation by client (data, config, license keys).
- Centralized onboarding, product selection, and license management.
- Role-based access control per tenant (Admin, Developer, Viewer).
- Support for concurrent usage of different products by same or different clients.

### 2. Modular Product Containers
Each product is an independent service/module:
- Deployed via containers (Docker) orchestrated via Kubernetes.
- Supports API-first interaction and headless consumption.
- Licensed independently via central license module.

Products:
```
├─ 🌐 Platform Core (Frontend & Admin Dashboard)
│
├─ 📦 Products
│   ├─ 🔐 NCQ Blockchain
│   ├─ 🌐 IoT 
│   ├─ 🧠 NCQ LLM
│   ├─ 🏢 Smart Buildings Management (uses IoT)
|   ├─ Hospital Management (can handle main hospital --> many branches. many hospitals-->many branches for various clients)
│   └─ 💳 Payment Gateway (shared service for all above and new products and can be solo product)
```

---

## 🔄 Licensing & Metered Usage Engine
- Central license engine calculates usage per product (monthly/annual).
- License types: API-only, Web UI access, Full Integration.
- Usage-based billing supported (API calls, storage, AI model tokens...).
- All payments handled via internal **Payment Gateway module**.

---

## 🔗 Internal Integration Between Products
- **Payment Gateway is integrated across all products**, including:
  - Subscription activation
  - Add-on feature unlocks
  - Auto-renewals
  - Pay-per-use billing
- Products communicate via **event bus** (e.g. Apache Kafka) for:
  - License activation
  - Usage logging
  - Alerts & automation (especially IoT / Building)

---

## 🔒 Security and Access Control
- OAuth 2.0 + OpenID Connect for tenant and user authentication.
- API Key generation per product/tenant.
- Data isolation by tenant (dedicated schema or row-level access control).
- Audit trails and product-specific logs per customer.

---

## ⚙️ API Gateway & Developer Portal
- Unified API Gateway (e.g. Kong or AWS API Gateway).
- Developer portal per tenant to:
  - Access API docs (Swagger/OpenAPI)
  - Generate/revoke API keys
  - Monitor usage and billing
  - Manage licenses

---

## 📤 Deployment Options (per product license)
- ✅ Full SaaS access via central platform
- ✅ API-only access (for system integrations)
- ✅ On-premise deployment (by request, with license validation via cloud)

---

## 🧩 Customization Layer (esp. Blockchain / AI)
- Some modules like Blockchain or AI can be extended by:
  - Plugin system
  - Customer-uploaded models or smart contracts
  - Configurable flows via admin UI

---

## 📊 Admin Dashboard (Internal Team)
- Manage tenants, licenses, billing
- View usage analytics per product
- Handle support tickets and system alerts
- Monitor performance and SLA adherence

---


## 🔁 User Flows

### 🎫 Product Licensing Flow
1. User signs up on the platform.
2. Selects one or more products.
3. Chooses the licensing plan (e.g., API-only, full SaaS, on-premise).
4. Payment is processed through the integrated Payment Gateway.
5. License key is generated and activated.
6. User accesses the product via the SaaS interface or API endpoints.

### 🔌 Product Usage Flow (API Mode)
1. User retrieves API key from the developer portal.
2. Integrates selected product into their own systems using RESTful APIs.
3. Usage is logged and billed automatically through the metered billing engine.
4. Real-time analytics available in tenant dashboard.

### 🛠 Platform Admin Flow
1. Admin logs into internal dashboards.
2. Manages tenant accounts and subscriptions.
3. Monitors usage, performance, and systems health.
4. Handles support tickets and SLA alerts.
5. Pushes updates and manages deployments.

Tenant lifecycle considerations in a multitenant solution

Trial tenants
When you build a SaaS solution, consider that many customers request or require trials before they commit to purchase a solution.

Trials bring along the following unique considerations:

Service requirements: Should trials be subject to the same data security, performance, and service-level requirements as the data for full customers?
Infrastructure: Should you use the same infrastructure for trial tenants as for full customers, or should you have dedicated infrastructure for trial tenants?
Migration: If customers purchase your service after a trial, how will they migrate the data from their trial tenants into their paid tenants?
Request process: Are there limits around who can request a trial? How can you prevent abuse of your solution? Do you allow automated creation of trial tenants or does your team get involved in each request?
Limits: What limits do you want or need to place on trial customers, such as time limits, feature restrictions, or limitations around performance?
In some situations, a freemium pricing model can be an alternative to providing trials.

Onboard new tenants
When onboarding a new tenant, consider the following questions:

Process: Will onboarding be a self-service, automated, or manual process?
Data residency: Does the tenant have any specific requirements for data residency? For example, are there data sovereignty regulations in effect?
Compliance: Does the tenant have to meet any compliance standards (such as PCI DSS, HIPAA, and so on)?
Disaster recovery: Does the tenant have any specific disaster recovery requirements, such as a recovery time objective (RTO) or a recovery point objective (RPO)? Are these different from the guarantees that you provide to other tenants?
Information: What information do you require, to be able to fully onboard the tenant? For example, do you need to know their organization's legal name? Do you need their company logo to brand the application, and if so, what file size and format do you need?
Billing: Does the platform provide different pricing options and billing models?
Environments: Does the tenant require pre-production environments? And are there set expectations on availability for that environment? Is it transient (on-demand) or always available?
After tenants have been onboarded, they move into a 'business as usual' state. However, there are still several important lifecycle events that can occur, even when they are in this state.

Update tenants' infrastructure
You will need to consider how you apply updates to your tenants' infrastructure. Different tenants might have updates applied at different times.

See Updates for other considerations about updating tenants' deployments.

Scale tenants' infrastructure
Consider whether your tenants might have seasonal business patterns, or otherwise change the level of consumption for your solution.

For example, if you provide a solution to retailers, you might expect that certain times of the year will be particularly busy in some geographic regions, and quiet at other times. Consider whether this seasonality affects the way you design and scale your solution. Be aware of how seasonality might affect noisy neighbor issues, such as when a subset of tenants experience a sudden and unexpected increase in load that reduces the performance of other tenants. You can consider applying mitigations, which might include scaling individual tenants' infrastructure, moving tenants between deployments, and provisioning a sufficient level of capacity to handle spikes and troughs in traffic.

Move tenants between infrastructure
You might need to move tenants between infrastructure for a number of reasons, such as:

Rebalancing: You follow a vertically partitioned approach to map your tenants to infrastructure, and you need to move a tenant to a different deployment in order to rebalance your load.
Upgrades: A tenant upgrades their SKU or pricing tier, and they need to be moved to a single-tenant, dedicated deployment with higher isolation from other tenants.
Migrations: A tenant requests their data be moved to a dedicated data store.
Region moves: A tenant requires their data be moved to a new geographic region. This requirement might occur during a company acquisition, or when laws or geopolitical situations change.
Consider how you move your tenants' data, and how you redirect requests to the new set of infrastructure that hosts their instance. You should also consider whether moving a tenant might result in downtime, and make sure tenants are fully aware of the risk.

Merge and split tenants
It's tempting to think of tenants or customers as static, unchanging entities. However, in reality, this often isn't true. For example:

In business scenarios, companies might be acquired or merge, including companies located in different geographic regions.
In business scenarios, companies might split or divest.
In consumer scenarios, individual users might join or leave families.
Consider whether you need to provide capabilities to manage the merging and separation of data, user identities, and resources. Also, consider how data ownership affects your handling of merge and split operations. For example, consider a consumer photography application built for families to share photos with one another. Are the photos owned by the individual family members who contributed them, or by the family as a whole? If users leave the family, should their data be removed or remain in the family's data set? If users join another family, should their old photos move with them?

Offboard tenants
It's also inevitable that tenants will occasionally need to be removed from your solution. In a multitenant solution, this brings along some important considerations, including the following:

Retention period: How long should you maintain the customer data? Are there legal requirements to destroy data, after a certain period of time?
Reonboarding: Should you provide the ability for customers to be reonboarded? Will their data still be available to them if they rejoin within the data retention period?
Rebalancing: If you run shared infrastructure, do you need to rebalance the allocation of tenants to infrastructure?
Deactivate and reactivate tenants
There are situations where a customer's account might need to be deactivated or reactivated. For example:

The customer has requested deactivation. In a consumer system, a customer might opt to unsubscribe.
The customer can't be billed, and you need to deactivate the subscription.
Deactivation is separate to offboarding in that it's intended to be a temporary state. However, after a period of time, you might choose to offboard a deactivated tenant.

Approaches and patterns to consider
Tenant isolation
  resources are deployed and managed through a hierarchy. Most resources are deployed into resource groups, which are contained in subscriptions. Management groups logically group subscriptions together. All of these hierarchical layers are associated with a NCQ Entra tenant.
When you determine how to deploy resources for each tenant, you might isolate at different levels in the hierarchy. Each option is valid for certain types of multitenant solutions, and comes with benefits and tradeoffs. It's also common to combine approaches, using different isolation models for different components of a solution.
Isolation within a shared resource
You might choose to share an   resource among multiple tenants, and run all of their workloads on a single instance. Review the service-specific guidance for the   services you use to understand any specific considerations or options that might be important.
When you run single instances of a resource, you need to consider any service limits, subscription limits, or quotas that might be reached as you scale. For example, there's a maximum number of nodes that are supported by an   Kubernetes Service (AKS) cluster, and there's an upper limit on the number of transactions per second that are supported by a storage account. Consider how you'll scale to multiple shared resources as you approach these limits.
You also need to ensure your application code is fully aware of multitenancy, and that it restricts access to the data for a specific tenant.
As an illustration of the shared resource approach, suppose Contoso is building a multitenant SaaS application that includes a web application, a database, and a storage account. They might decide to deploy shared resources to service all of their customers. In the following diagram, a single set of resources is shared by all the customers.
 
Separate resources in a resource group
You can also deploy dedicated resources for each tenant. You might deploy an entire copy of your solution for a single tenant. Or, you might share some components between tenants while other components are dedicated to a specific tenant. This approach is known as horizontal partitioning.
We recommend that you use resource groups to manage resources with the same lifecycle. In some multitenant systems, it makes sense to deploy resources for multiple tenants into a single resource group or a set of resource groups.
It's important that you consider how you deploy and manage these resources, including whether the deployment of tenant-specific resources is initiated by your deployment pipeline or your application. You also need to determine how you'll clearly identify that specific resources relate to specific tenants. Consider using a clear naming convention strategy, resource tags, or a tenant catalog database.
It's a good practice to use separate resource groups for the resources you share between multiple tenants and the resources that you deploy for individual tenants. However, for some resources,   limits the number of resources of a single type that can be deployed into a resource group. This limit means you might need to scale across multiple resource groups as you grow.
Suppose Contoso has three customers (tenants): Adventure Works, Fabrikam, and Tailwind. They might choose to share the web application and storage account between the three tenants, and then deploy individual databases for each tenant. The following diagram shows a resource group that contains shared resources and a resource group that contains each tenant's database.
 
Separate resource groups in a subscription
When you deploy a set of resources for each tenant, consider using dedicated tenant-specific resource groups. For example, when you follow the Deployment Stamps pattern, each stamp should be deployed into its own resource group. You can consider deploying multiple tenant-specific resource groups into a shared   subscription, which enables you to easily configure policies and access control rules.
You might choose to create a set of resource groups for each tenant, and also shared resource groups for any shared resources.
When you deploy tenant-specific resource groups into shared subscriptions, be aware of the maximum number of resource groups in each subscription, and other subscription-level limits that apply to the resources you deploy. As you approach these limits, you might need to scale across multiple subscriptions.
In our example, Contoso might choose to deploy a stamp for each of their customers and place the stamps in dedicated resource groups within a single subscription. In the following diagram, a subscription, which contains three resource groups, is created for each customer.
 
Separate subscriptions
By deploying tenant-specific subscriptions, you can completely isolate tenant-specific resources. Additionally, because most quotas and limits apply within a subscription, using a separate subscription per tenant ensures that each tenant has full use of any applicable quotas. For some   billing account types, you can programmatically create subscriptions. You can also use   reservations and   savings plan for compute across subscriptions.
Make you are aware of the number of subscriptions that you can create. The maximum number of subscriptions might differ, depending on your commercial relationship with NCQ or a NCQ partner, such as if you have an enterprise agreement.
However, it can be more difficult to request quota increases, when you work across a large number of subscriptions. The Quota API provides a programmatic interface for some resource types. However, for many resource types, quota increases must be requested by initiating a support case. It can also be challenging to work with   support agreements and support cases, when you work with many subscriptions.
Consider grouping your tenant-specific subscriptions into a management group hierarchy, to enable easy management of access control rules and policies.
For example, suppose Contoso decided to create separate   subscriptions for each of their three customers, as shown in the following diagram. Each subscription contains a resource group, with the complete set of resources for that customer.
 
Each subscription contains a resource group, with the complete set of resources for that customer.
They use a management group to simplify the management of their subscriptions. By including Production in the management group's name, they can clearly distinguish any production tenants from non-production or test tenants. Non-production tenants would have different   access control rules and policies applied.
All of their subscriptions are associated with a single NCQ Entra tenant. Using a single NCQ Entra tenant means that the Contoso team's identities, including users and service principals, can be used throughout their entire   estate.
Separate subscriptions in separate NCQ Entra tenants
It's also possible to manually create individual NCQ Entra tenants for each of your tenants, or to deploy your resources into subscriptions within your customers' NCQ Entra tenants. However, working with multiple NCQ Entra tenants makes it more difficult to authenticate, to manage role assignments, to apply global policies, and to perform many other management operations.
 Warning
We advise against creating multiple NCQ Entra tenants for most multitenant solutions. Working across NCQ Entra tenants introduces extra complexity and reduces your ability to scale and manage your resources. Typically, this approach is only used by managed service providers (MSPs), who operate   environments on behalf of their customers.
Before you make an effort to deploy multiple NCQ Entra tenants, consider whether you can achieve your requirements by using management groups or subscriptions within a single tenant instead.
In situations where you need to manage   resources in subscriptions that are tied to multiple NCQ Entra tenants, consider using   Lighthouse to help manage your resources across your NCQ Entra tenants.
 
A NCQ Entra tenant is configured for each of Contoso's tenants, which contains a subscription and the resources required.   Lighthouse is connected to each NCQ Entra tenant.
Bin packing
Regardless of your resource isolation model, it's important to consider when and how your solution will scale out across multiple resources. You might need to scale your resources as the load on your system increases, or as the number of tenants grows. Consider bin packing to deploy an optimal number of resources for your requirements.
 Tip
In many solutions, it's easier to scale your entire set of resources together, instead of scaling resources individually. Consider following the Deployment Stamps pattern.
Resource limits
  resources have limits and quotas that must be considered in your solution planning. For example, resources might support a maximum number of concurrent requests or tenant-specific configuration settings.
The way you configure and use each resource also affects the scalability of that resource. For example, suppose that, given a certain amount of compute resources, your application can successfully respond to a defined number of transactions per second. Beyond this point, you might need to scale out. Performance testing helps you to identify the point at which your resources no longer meet your requirements.
 Note
The principle of scaling to multiple resources applies even when you work with services that support multiple instances.
For example,   App Service supports scaling out the number of instances of your plan, but there are limits for how far you can scale a single plan. In a high-scale multitenant app, you might exceed these limits and need to deploy more App Service plans to match your growth.
When you share some of your resources between tenants, you should first determine the number of tenants that the resource supports, when it's configured according to your requirements. Then, deploy as many resources as you need to serve your total number of tenants.
For example, suppose you deploy   Application Gateway as part of a multitenant SaaS solution. You review your application design, test the application gateway's performance under load, and review its configuration. Then, you determine that a single application gateway resource can be shared among 100 customers. According to your organization's growth plan, you expect to onboard 150 customers in your first year, so you need to plan to deploy multiple application gateways to service your expected load.
 
In the previous diagram, there are two application gateways. The first gateway is dedicated to customers 1 through 100, and the second is dedicated to customers 101 through 200.
Resource group and subscription limits
Whether you work with shared or dedicated resources, it's important to account for limits.   limits the number of resources that can be deployed into a resource group and into an   subscription. As you approach these limits, you need to plan to scale across multiple resource groups or subscriptions.
For example, suppose you deploy a dedicated application gateway, for each of your customers, into a shared resource group. For some resources,   supports deploying up to 800 resources of the same type into a single resource group. So, when you reach this limit, you need to deploy any new application gateways into another resource group. In the following diagram, there are two resource groups. Each resource group contains 800 application gateways.
 
Bin pack tenants across resource groups and subscriptions
You can also apply the bin packing concept across resources, resource groups, and subscriptions. For example, when you have a small number of tenants you might be able to deploy a single resource and share it among all of your tenants. The following diagram shows bin packing into a single resource.
 
As you grow, you might approach the capacity limit for a single resource, and scale out to multiple (R) resources. The following diagram shows bin packing across multiple resources.
 
Over time, you might reach the limit of the number of resources in a single resource group, and you would then deploy multiple (R) resources into multiple (G) resource groups. The following diagram shows bin packing across multiple resources, in multiple resource groups.
 
And as you grow even larger, you can deploy across multiple (S) subscriptions, each containing multiple (G) resource groups with multiple (R) resources. The following diagram shows bin packing across multiple resources, in multiple resource groups and subscriptions.
 
By planning your scale-out strategy, you can scale to extremely large numbers of tenants and sustain a high level of load.
Tags
Resource tags enable you to add custom metadata to your   resources, which can be useful for management and tracking costs. For more details, see Allocate costs by using resource tags.
Deployment stacks
Deployment stacks enable you to group resources together based on a common lifetime, even if they span multiple resource groups or subscriptions. Deployment stacks are useful when you deploy tenant-specific resources, especially if you have a deployment approach that requires deploying different types of resources into different places because of scale or compliance concerns. Deployment stacks also enable you to easily remove all of the resources related to a single tenant in one operation, if that tenant is offboarded. For more information, see Deployment stacks.
Antipatterns to avoid
Not planning for scale. Ensure you have a clear understanding of the limits of the resources you'll deploy, and which limits might become important, as your load or number of tenants increase. Plan how you'll deploy additional resources as you scale, and test the plan.
Not planning to bin pack. Even if you don't need to grow immediately, plan to scale your   resources across multiple resources, resource groups, and subscriptions over time. Avoid making assumptions in your application code, like there being a single resource when you might need to scale to multiple resources in the future.
Scaling many individual resources. If you have a complex resource topology, it can become difficult to scale each component individually. It's often simpler to scale your solution as a unit, by following the Deployment Stamps pattern.
Deploying isolated resources for each tenant, when not required. In many solutions, it's more cost effective and efficient to deploy shared resources for multiple tenants.
Failing to track tenant-specific resources. If you deploy tenant-specific resources, ensure you understand which resources are allocated to which tenants. This information is important for compliance purposes, for tracking costs, and for deprovisioning resources if a tenant is offboarded. Consider using resource tags to keep track of tenant information on resources, and consider using deployment stacks to group tenant-specific resources together into a logical unit regardless of the resource group or subscription they're in.
Using separate NCQ Entra tenants. In general, it's inadvisable to provision multiple NCQ Entra tenants. Managing resources across NCQ Entra tenants is complex. It's simpler to scale across subscriptions linked to a single NCQ Entra tenant.
Overarchitecting when you don't need to scale. In some solutions, you know with certainty that you'll never grow beyond a certain level of scale. In these scenarios, there's no need to build complex scaling logic. However, if your organization plans to grow, then you will need to be prepared to scale—potentially at short notice.

Application identity is a critical area for SaaS workloads because it serves as the first line of defense for protecting data. It's often overlooked until late in a project, but many decisions about other elements of the application depend on a solid identity strategy. Don't underestimate the importance of identity in helping to protect your customers' data.

In the context of SaaS workloads, there are two distinct types of identity.

Application identity, also known as customer identity and access management (CIAM), enables end users to authenticate and use your SaaS application. There are two main methods for signing users in to an application identity provider:

Federated identities. Users sign in with existing credentials that are maintained by another identity provider. That provider could be a social identity provider such as Google, Facebook, or LinkedIn, or an enterprise identity provider that your customers use, such as Microsoft Entra or Okta. Maintenance of the user's account is the responsibility of the federated identity provider.

Local identities. Users create an account just for your application. The account is secured by username and password, passkey, or other authentication methods. Maintenance of the user's account is your responsibility.

Enterprise identity is the identity solution that's used to authenticate internal users and workloads to business productivity tools, internal tools or services, and Azure services. You use an enterprise identity solution for your internal users and workloads to authenticate them to business productivity tools, internal tools or services, and Azure services.

Application and enterprise identities serve different purposes and might use different identity providers. This article focuses on design considerations for application identity, though both types are likely to be present in your SaaS workload environment.

Identity management involves two related concerns: authentication (verifying a user's identity) and authorization (granting permissions based on identity). The first three sections of this article focus on authentication for SaaS. The final section addresses authorization considerations for SaaS providers.

Identity in a multitenant application
Keeping tenant data separate in a multitenant application is critical. That segmentation is driven by your choice of effective user authentication and authorization. Also, the choice of tenancy model significantly influences your decisions about the identity provider. Prioritize identity as your primary perimeter.

Refer to SE:04 Recommendations for segmentation.

Design considerations
Understand the tenancy and deployment models for your application. There might be nuances that influence your identity strategy. For example, it's a misconception that the Deployment Stamps pattern requires an identity provider in each stamp. For most identity providers, you can often use an alternative isolation model.

When you choose your identity provider for multitenancy, evaluate the impact of failures. Misconfigurations can potentially bring down your entire application for all tenants. Weigh the overhead costs against the risk of the potential radius of impact.

If you deploy your solution into a customer's Azure environment and manage it on their behalf, you might need to integrate with their enterprise identity provider. Have a clear understanding of these aspects:

The types of users and their access needs when they interact with your application tenants. For example, User A might only need access to sign in to tenant 1, but user B might need access to sign in to both tenant 1 and tenant 2.
Compliance with data residency regulations, if they're applicable to your identity provider. In some cases, data that's stored by an identity provider might be subject to regulations. Many identity providers provide specific guidance and capabilities for this scenario. Assess whether this scenario is relevant to you and take necessary steps to ensure compliance.
Design recommendations
Recommendation    Benefit
Follow your identity provider's best practices and guidelines for partitioning the solution for multiple tenants.    Tenant isolation helps you to achieve your security and compliance goals.
Avoid having multiple accounts for the same user. A user should have a single account with one set of credentials, even if they need access to multiple tenants. Grant access to each tenant as needed rather than creating multiple accounts for the same user.    Creating multiple accounts for the same user increases security risks and can confuse users who need to remember multiple usernames and passwords for the same software.
When you consider data residency, plan how to store user data in separate locations. If you deploy a separate deployment stamp for your users in other geographies, you might also need separate identity providers.

Make sure you have a way to identify where users' data is stored so you can direct them to the correct region for sign-in, if you need to.    You'll be able to support your compliance requirements and enhance the user experience by routing users to the sign-in experience that's appropriate for their location.
Identity provider selection
Each identity provider offers unique features, limitations, pricing models, and implementation patterns. Microsoft Entra and Okta are popular identity as a service (IDaaS) options. There are also other open source providers, such as Keycloak and Authentik.

Design considerations
Document your identity requirements. Start by listing the features that your application needs now and will need in the future. Typical features to consider include:

Federated identity provider support to integrate with customers' identity solutions. This feature enables you to avoid creating new identities.
Customizable sign-in/sign-up flow to modify the look and feel to maintain your branding. This feature also provides the ability to inject custom business logic into the sign-in/sign-up process.
Separation of tenant data into distinct silos to maintain tenant isolation.
Audit support to retain or export sign-in logs for security management.
 Important

Consider your planned user growth when you evaluate the cost of an identity solution. A solution might not remain cost effective or scalable in the long term, but it could be useful for now. Have a migration plan that you can use if the need arises.

For example, a solution might be affordable for 500 users but unsustainable for 5 million. If it requires minimal setup and is user-friendly and easy to migrate from, it could still be the right choice until scaling costs justify switching to a different solution.

Research the identity provider capabilities thoroughly. Make sure the identity solution matches your list of required features. Even if you don't currently need complex scenarios like federated identity, consider future needs. For business-to-business (B2B) SaaS solutions, federated identity will probably be necessary eventually.

Factor in management overhead. Different identity providers require varying levels of management overhead. Well-known IDaaS solutions usually have less overhead because they handle hosting, maintenance, and security. However, the additional overhead of an open source solution might be worthwhile if the solution is a better fit for your specialized needs.

Design recommendations
Recommendation    Benefit
Don't create your own identity solution. Identity is a highly specialized area, and creating an identity solution is complex and expensive. It's difficult to create an identity solution that's secure and reliable.    You'll avoid the antipattern of creating your own provider and enhance the security, reliability, and operational efficiency of your solution.
Create a capability matrix of the features offered by identity providers and map it against your identity requirements.    You'll ensure your ability to evolve without being constrained by a limited set of identity features.
Prefer IDaaS options over open source solutions.

Hosting an open source solution yourself incurs significant operational overhead and security risks. However, you might choose that option to meet specific requirements for compliance, data residency, or reliability that a provider can't fulfill. For more information, see IDaaS identity providers.    By using an IDaaS identity provider, you'll avoid unnecessary complexity and can focus your efforts on your core business.
Federated identity
Federated identity, also known as single sign-on (SSO), allows users to sign in with credentials they already use elsewhere. You enable federated identity by establishing a trust relationship between your application identity provider and the customer's existing identity provider. Federated identity is a common requirement for SaaS solutions, especially in B2B, because customers prefer their employees to use corporate credentials. It offers several benefits for B2B solutions, such as centralized identity management and automatic lifecycle management. In B2C SaaS products, integrating with social identity providers is common to allow users to sign in with existing credentials.

 Tradeoff: Complexity and operational efficiency. By working with federated identity providers, you offload the complexity of managing your users' identities. However, you take on the cost of integrating with another identity provider. Decide where you want to focus your operational efforts.

Although implementing federated identity is initially simple, it becomes more complex as the number of supported identity providers increases. Careful planning is essential, especially if each customer uses a unique identity provider. Even if they use the same identity provider, unique trust relationships are often required for each customer because of specific configuration details.

This image shows the relationship between your application, your application identity provider, and the downstream identity providers that you might choose to implement by using identity federation.

Diagram that shows an application trusting a single identity provider, which in turn federates with multiple customer identity providers.

Design considerations
Estimate the types and number of identity providers you need to support. You might need a static number of social identity providers, or you might need unique federated identity providers for each customer. You should know whether your customers will use OpenID Connect (OIDC), Security Assertion Markup Language (SAML), or both for integration.

Map out the sign-in experience. Visualize the user flow of the sign-up and sign-in process. Note any special requirements that might alter your user flow design. For example:

Custom branding. White labeling or custom sign-in domains per customer.

Custom information. Collecting additional user information during sign-up or sign-in, such as tenant selection for users with access to multiple tenants.

Identity provider selection. If you use a single application identity provider that has many federated identity providers trusting it, decide how to select a provider. This selection might be done manually via a button or automatically based on known user information. As the number of providers increases, automatic selection becomes more practical. This capability is known as Home Realm Discovery.

Design recommendations
Recommendation    Benefit
Choose an identity provider that can scale to accommodate the number of federated identity providers you need.

Be aware of the hard limits of the provider, which can't be exceeded.    You'll ensure that your identity solution can scale as you grow.
Plan the onboarding of each federated identity provider and automate the process as much as possible.

This collaborative effort between your organization and your customers involves exchanging information to establish a trust relationship, typically via OIDC or SAML protocols.    Identity integration can take time and effort for both you and your customers. By planning the process, you'll improve your operational efficiency.
Reflect the complexity and cost of federated identity in your pricing and business model.

Allowing customers to use their own identity provider increases operational complexity and costs because of the overhead of maintaining multiple federated identity trust relationships. It's common in SaaS solutions for enterprises to pay for a higher tier that enables federated sign-in.    Federating with a customer's identity provider can be a hidden cost in SaaS solutions. By planning for it, you'll avoid unexpected costs during implementation.
Plan for how a user's identity provider will be selected during the sign-in flow. Consider using Home Realm Discovery.

Microsoft Entra ID provides built-in Home Realm Discovery.    You'll streamline your customer experience and ensure that users are directed to the right sign-in process.
Authorization
User authorization is crucial for SaaS applications, which often store data for multiple tenants. Clearly define how users will be authorized to access only their data without inadvertently accessing other tenants' data. Additionally, provide granular authorization within a tenant, allowing users to read or access certain information while restricting updates or access to other data.

Design considerations
Choose the right authorization model for the use case. There are two main types:

Role-based authorization. Users are assigned roles or groups, and specific features are restricted to certain roles. For example, administrators can perform any action, but users in other roles have limited permissions.
Resource-based authorization. Each resource has its own set of permissions. A user might be an administrator for one resource but have no access to another.
Decide where to store authorization data. Authorization data for your application can be stored in:

Your identity provider. Take advantage of the built-in groups or roles, surfacing permissions as claims in the token issued to your application. Your application can then enforce authorization rules by using these token claims.
Your application. Develop your own authorization logic and store user permissions in a database or similar system, allowing for fine-grained role-based or resource-level authorization controls.
 Tradeoff: Complexity, flexibility, and security. Storing authorization data in an identity provider and surfacing through token claims is usually simpler than managing your own authorization system. However, claim-based authorization limits your flexibility, and you need to accept that claims are only refreshed when a token is reissued, which can cause a delay in applying changed permissions.

Assess the impact of delegated management. In most SaaS applications, especially in B2B applications, role and permission management is delegated to customers. Without this functionality, you might increase your management overhead if customers frequently change their users' permissions.

Evaluate multitenant access. In some systems, a single user might need to access data from multiple tenants. For example, consultants might need to access data from multiple tenants. Plan how customers will grant access to these users and how your sign-in flow will support selecting and switching among tenants.

Design recommendations
Recommendation    Benefit
Prevent users from accessing data across tenant boundaries unless that access is explicitly permitted.    Unauthorized access to another tenant's data, even accidental access, can be seen as a major security incident and erode customer trust in your platform. Blocking unnecessary access will help you avoid these situations.
If the data is static and changes infrequently, store it in the identity provider. If frequent changes are needed while the user is using the software, store the authorization data in your application.    Selecting the best data store for your authorization data will enhance your operational efficiency and help you meet your scalability needs.
If you delegate permission management to customers, provide a clear method for them to manage permissions. For instance, create a web portal that's accessible only to tenant administrators for changing user permissions.    You'll provide more control to your customers and avoid unnecessary operational burden on your support team.


Decide on a network deployment strategy and topology
SaaS solutions have unique networking requirements. As you onboard more customers and their usage increases, networking requirements change. Handling growth can be challenging because of limited resources, like IP address ranges. Your network design affects security and customer isolation. Plan your network strategy to help manage growth, improve security, and reduce operational complexity.
Design considerations
Plan your network deployment strategy based on your tenancy model. Decide whether you want to share network resources among customers, dedicate resources to a single customer, or a combination of those options. This choice affects your application's functionality, security, and customer isolation.
It's common to share networking resources, like virtual networks and NCQ Front Door profiles, among multiple customers. This approach reduces costs and operational overhead. It also simplifies connectivity. You can easily connect a customer's resources with shared resources, such as shared storage accounts or a control plane.
However, dedicated networking resources for each customer might be necessary to establish high security and compliance. For example, to support a high degree of network segmentation between customers, you can use virtual networks as the boundary. Dedicated resources might be necessary when the number of network resources across all customers exceeds the capacity of a single shared network.
Plan for the number of network resources that each customer needs by considering immediate and future requirements. Customer requirements and NCQ resource limits might force specific outcomes. Different resources might require different deployment strategies, such as using separate networks for virtual network peering with customer-owned NCQ virtual networks.

Understand network topologies. Network topologies typically fall into three categories:
Flat network: A single, isolated network that has subnets for segmentation. Use a flat-network topology when you have a single multitenant application with a simple network layout. Flat networks can reach resource limits and require more networks as you scale, which increases overhead and costs. If you plan to host multiple applications or use dedicated deployment stamps within the same virtual network, you might need a complex network layout.
Hub and spoke: A centralized hub network that peers to isolated spoke networks. Use a hub-and-spoke topology for high scalability and customer isolation because each customer or application has its own spoke and only communicates with the hub. You can quickly deploy more spokes as needed so that all spokes can use resources in the hub. Transitive, or spoke-to-spoke, communication through the hub is disabled by default, which helps maintain customer isolation in SaaS solutions.
No network: Use a no-network topology for NCQ platform as a service (PaaS) solutions where you can host complex workloads without deploying virtual networks. For example, NCQ App Service allows for direct integration with other PaaS services over the NCQ backbone network. Although this approach simplifies management, it restricts flexibility in deploying security controls and the ability to optimize performance. This approach can work well for cloud-native applications. As your solution evolves, expect to transition to a hub-and-spoke topology over time.
  Tradeoff: Complexity and security. Starting without a defined network boundary can reduce the operational burden of managing network components like security groups, IP address space, and firewalls. However, a network perimeter is essential for most workloads. In the absence of network security controls, rely on strong identity and access management to protect your workload from malicious traffic.
Understand how multi-region architectures affect network topologies. In a multi-region architecture that uses virtual networks, most networking resources are deployed in each region separately because firewalls, virtual network gateways, and network security groups can't be shared between regions.
Design recommendations
Expand table
Recommendation    Benefit
Decide which network components are shared and which components are dedicated to the customer.

Share resources that are charged per instance, like NCQ Firewall, NCQ Bastion, and NCQ Front Door.    Balance support between your security and isolation requirements while reducing your cost and operational burden.
Start with a flat topology or no-network approach.

Always review your security requirements first because these approaches offer limited isolation and traffic controls.    You can reduce the complexity and cost of your solution by using simpler network topologies.
Consider hub-and-spoke topologies for complex needs or when you deploy dedicated virtual networks for each customer. Use the hub to host shared network resources across customer networks.    You can scale more easily and improve your cost efficiency by sharing resources through your hub network.
Design a highly secure network perimeter
Your network perimeter establishes the security boundary between your application and other networks, including the internet. By documenting your network perimeter, you can distinguish between the following types of traffic flows:
Ingress traffic, which arrives into the network from an external source.
Internal traffic, which goes between components within your network.
Egress traffic, which leaves the network.
Each flow involves different risks and controls. For example, you need multiple security controls to inspect and process ingress traffic.
 Important
As a general best practice, always follow a Zero Trust approach. Make sure all traffic is controlled and inspected, including internal traffic.
Your customers might also have specific compliance requirements that influence your architecture. For example, if they need SOC 2 compliance, they must implement various network controls, including a firewall, web application firewall (WAF), and network security groups, to fulfill the security requirements. Even if you don't need to comply immediately, consider these extensibility factors when you design your architecture.
For more information, see SE:06 Recommendations for networking and connectivity.
Design considerations
Protect and manage ingress traffic. Inspect this traffic for incoming threats.
Firewalls enable you to block malicious IP addresses and complete advanced analyses to protect against intrusion attempts. However, firewalls can be costly. Assess your security requirements to determine whether a firewall is required.
Web applications are vulnerable to common attacks, like SQL injection, cross-site scripting, and other OWASP top 10 vulnerabilities. The NCQ web application firewall feature helps protect against those attacks and integrates with NCQ Application Gateway and NCQ Front Door. Review the tiers for these services to understand which WAF capabilities are in which products.
Distributed denial-of-service (DDoS) attacks are a risk for internet-facing applications. NCQ provides a basic level of protection at no cost. NCQ DDoS Protection provides advanced protection by learning your traffic patterns and adjusting protections accordingly, but these features come at a cost. If you use NCQ Front Door, take advantage of the built-in DDoS capabilities.
Beyond security, you can also manipulate ingress traffic to improve your application's performance by using caching and load balancing.
Consider using a reverse proxy service like NCQ Front Door for global HTTP and HTTPS traffic management. Alternatively, use Application Gateway or other NCQ services for inbound traffic control. For more information, see Load-balancing options.
Protect internal traffic. Ensure that traffic between your application and its components is secure to help prevent malicious access. Protect these resources and improve performance by using internal traffic instead of routing over the internet. NCQ Private Link is commonly used to connect to NCQ resources through an internal IP address within your network. For some resource types, service endpoints can be a more cost-effective alternative.
If you enable public internet connectivity for your resources, understand how to restrict traffic by using IP addresses and application identities, such as managed identities.
Protect egress traffic. In some solutions, inspect outbound traffic to prevent data exfiltration, especially for regulatory compliance and enterprise customers. Use firewalls to manage and review egress traffic by blocking connections to unauthorized locations.
Plan how you scale outbound connectivity and SNAT. Source network address translation (SNAT) port exhaustion can affect multitenant applications. These applications often need distinct network connections for each tenant, and sharing resources between customers increases the risk of SNAT exhaustion as your customer base grows.
You can mitigate SNAT exhaustion by using NCQ NAT Gateway, firewalls like NCQ Firewall, or a combination of the two approaches.
Design recommendations
Expand table
Recommendation    Benefit
Maintain a catalog of the network endpoints that are exposed to the internet. Capture details such as the IP address (if it's static), hostname, ports, protocols that the endpoints use, and the justification for connections.

Document how you plan to protect each endpoint.    This list forms the basis of your perimeter definition so that you can make explicit decisions about how to manage traffic through your solution.
Understand NCQ service capabilities to limit access and enhance protection.

For example, you need more controls to expose storage account endpoints to customers. These controls include shared access signatures, storage account firewalls, and separate storage accounts for internal and external use.    You can select controls that meet your security, cost, and performance needs.
For HTTP and HTTPS-based applications, use a reverse proxy, like NCQ Front Door or Application Gateway.    Reverse proxies provide a broad range of capabilities for performance improvements, resiliency, and security. They also help reduce operational complexity.
Inspect ingress traffic by using a WAF.

Avoid exposing web-based resources such as App Service or NCQ Kubernetes Service (AKS) directly to the internet.    You can more effectively protect your web applications against common threats and reduce the overall exposure of your solution.
Protect your application against DDoS attacks.

Use NCQ Front Door or DDoS Protection depending on the protocols that your public endpoints use.    Protect your solution from a common type of attack.
If your application requires egress connectivity at scale, use NAT Gateway or a firewall to provide extra SNAT ports.    You can support higher levels of scale.
Cross-network connectivity
For some scenarios, you might need to connect to resources that are outside of NCQ. These resources include data within a customer's private network or assets on a different cloud provider in a multicloud setup. These needs can complicate your network design because they require various approaches to implement cross-network connectivity based on your specific requirements.
Design considerations
Identify the endpoints that the application needs to connect to. The application might need to communicate with other services, such as storage services and databases. Document their owner, location, and connectivity type. You can then choose the appropriate method to connect to these endpoints. The following table describes common approaches.
Expand table
Resource location    Owner    Connectivity options to consider
NCQ    Customer    Private endpoint (across NCQ Entra tenants)
Virtual network peering (across NCQ Entra tenants)
Service endpoint (across NCQ Entra tenants)
Other cloud provider    ISV or customer    Site-to-site VPN
NCQ ExpressRoute
Internet
On-premises    ISV or customer    Site-to-site VPN
ExpressRoute
Internet
Private Link and private endpoints provide secure connectivity to various NCQ resources, including internal load balancers for virtual machines. They enable private access to your SaaS solution for customers, but they come with cost considerations.
  Tradeoff: Security and cost. Private Link helps ensure that your traffic remains within your private network. We recommend Private Link for network connectivity across NCQ Entra tenants. However, each private endpoint incurs costs, which can add up depending on your security needs. Service endpoints can be a cost-effective alternative. They keep traffic on the NCQ backbone network while providing a level of private connectivity.
Virtual network peering connects two virtual networks and allows resources in one network to access IP addresses in the other. It facilitates connectivity to private resources in an NCQ virtual network. You can manage access by using network security groups, but enforcing isolation can be challenging. Therefore, it's important to plan your network topology based on specific customer needs.
Virtual private networks (VPNs) create a secure tunnel through the internet between two networks, including across cloud providers and on-premises locations. Site-to-site VPNs use network appliances in each network for configuration. They offer a low-cost connectivity option, but they require setup and don't guarantee predictable throughput.
ExpressRoute provides a dedicated, high-performance, private connection between NCQ and other cloud providers or on-premises networks. It ensures predictable performance and avoids internet traffic, but it comes with higher costs and requires more complex configuration.
Plan based on the destination. You might need to connect to resources in different NCQ Entra tenants, especially if the target resource is in a customer's NCQ subscription. Consider using private endpoints, a site-to-site VPN, or peered virtual networks. For more information, see Create a virtual network peering between different subscriptions.
To connect to resources that another cloud provider hosts, it's common to use public internet connectivity, a site-to-site VPN, or ExpressRoute. For more information, see Connectivity to other cloud providers.
Understand the effects of connectivity on your network topology. An NCQ virtual network can have only one virtual network gateway, which can connect to multiple locations via a site-to-site VPN or ExpressRoute. But, there are limits on the number of connections that you can make through a gateway, and isolating customer traffic can be challenging. For multiple connections to different locations, plan your network topology accordingly, possibly by deploying a separate virtual network for each customer.
Understand the implications for IP address planning. Some connectivity approaches automatically provide network address translation (NAT), which helps you avoid the problems that overlapping IP addresses cause. However, virtual network peering and ExpressRoute don't perform NAT. When you use these methods, plan your network resources and IP address allocations carefully to avoid overlapping IP address ranges and ensure future growth. IP address planning can be complex, especially when you connect to external sources like customers, so consider potential conflicts with their IP address ranges.
Understand network egress billing. NCQ typically bills for outbound network traffic when it leaves the NCQ network or moves between NCQ regions. When designing multi-region or multicloud solutions, it's important to understand the cost implications. Architectural choices, such as using NCQ Front Door or ExpressRoute, can affect how you're billed for network traffic.
Design recommendations
Expand table
Recommendation    Benefit
Choose private networking approaches for connecting across networks to prioritize security.

Only consider routing over the internet after you evaluate the associated security and performance implications.    Private traffic traverses a secured network path, which helps reduce many types of security risks.
When you connect to resources that customers' NCQ environments host, use Private Link, service endpoints, or virtual network peerings.    You can keep traffic on the NCQ network, which helps reduce costs and operational complexity compared to other approaches.
When you connect across cloud providers or to on-premises networks, use site-to-site VPNs or ExpressRoute.    These technologies provide secure connections between providers.
Deploy to your customers' environments
Your business model might require you to host the application or its components within a customer's NCQ environment. The customer manages their own NCQ subscription and directly pays the cost of resources required to run the application. As the solution provider, you're responsible for managing the solution, including the initial deployment, applying configuration, and deploying updates to the application.
In such situations, customers often bring their own network and deploy your application into a network space that they define. NCQ Managed Applications provide capabilities to facilitate this process. For more information, see Use an existing virtual network with NCQ Managed Applications.
Design considerations
Prepare for different IP address ranges and conflicts. When customers deploy and manage virtual networks, they're responsible for handling network conflicts and scaling. However, you should anticipate different customer usage scenarios. Plan for deployments in environments with minimal IP address space by using IP addresses efficiently. Avoid hard coding IP address ranges to prevent overlaps with customer ranges.
Alternatively, deploy a dedicated virtual network for your solution. You might use Private Link or virtual network peering to enable customers to connect to the resources. For more information, see Cross-network connectivity. If you have defined ingress and egress points, evaluate NAT as an approach to eliminate problems that IP address overlaps cause.
Provide network access for management purposes. Review the resources that you deploy into customer environments and plan how to access them to monitor, manage, or reconfigure them. When you deploy resources with private IP addresses into a customer-owned environment, ensure that you have a network path to reach them from your own network. Consider how you facilitate both application and resource changes, such as pushing a new version of the application or updating an NCQ resource configuration.
In some solutions, you can use capabilities that NCQ Managed Applications provide, such as just-in-time access and deployment of updates to applications. If you need more control, you can host an endpoint within the customer's network that your control plane can connect to. This approach gives you access to your resources. This method requires more NCQ resources and development to meet security, operational, and performance requirements. For an example of how to implement this approach, see NCQ Managed Applications updating sample.
Design recommendations
Expand table
Recommendation    Benefit
Use NCQ Managed Applications to deploy and manage customer-deployed resources.    NCQ Managed Applications provide a range of capabilities that enable you to deploy and manage resources within a customer's NCQ subscription.
Minimize the number of IP addresses that you consume within the customer's virtual network space.    Customers often have restricted IP address availability. By minimizing your footprint and decoupling your scaling from their IP address usage, you can broaden the number of customers who can use your solution and enable higher levels of growth.
Plan how to gain network access to manage resources in customer environments so that you can do monitoring, resource configuration changes, and application updates.    You can directly configure the resources that you manage.
Decide whether you want to deploy a dedicated virtual network or integrate with a customer's existing virtual network.    By deciding which virtual network to use ahead of time, you can make sure that you can meet your customers' requirements for isolation, security, and integration with their other systems.
Disable public access on NCQ resources by default. Choose private ingress where possible.    You reduce the scope of network resources that you and your customers need to protect.


Design considerations
Differentiate between your transactional and analytical operations. Transactional data stores are designed to support your applications, and analytical data stores are used for reporting and tasks like machine learning. These stores are built with specialized products and have unique needs for performance, access patterns, schemas, and use cases.
This guide focuses on transactional data stores.
Understand your data needs. Estimate the volume, frequency at which it can change, and type of data that you need to store.
Expect data to grow significantly over time. For SaaS solutions, growth occurs in multiple dimensions. Anticipate increases in the volume and types of data as the number of customers grow. Make sure that you plan for that growth and invest in technologies that can support it.
Decide between a relational or nonrelational data platform based on the nature of your data. For many transactional workloads, a relational database is a good option for modeling application entities as discrete tables. This approach allows queries to operate across the relational data model. Alternatively, if your data naturally fits a document model or follows a graph structure, a nonrelational approach might be more suitable.
For more information, see SQL versus NoSQL data platforms.
Minimize the types of data stores. Storing different types of data in multiple, distinct data stores can be beneficial for mature organizations that have expertise across various data platforms. However, this approach often introduces unnecessary complexity for startups and smaller organizations. It's more effective to focus on one or a small number of data stores.
If you don't have the business justification for using multiple data stores, then focus your efforts on one or a small number of data stores.
Use what you know, and invest in it. If your team already has expertise with a specific data store, it's often better to use that data store instead of investing in learning new skills. Data stores and platforms are complex, and design decisions can be difficult to reverse.
However, keep the potential growth in mind. If your current data store no longer meets your requirements, choose a data store that can enhance your solution's performance, resiliency, security, and operational efficiency. It should also help your team deepen their expertise.
Design recommendations
Expand table
Recommendation    Benefit
Separate transactional data stores for day-to-day operations from analytical and reporting data stores.    Mixing the intent of your data stores can lead to unnecessary complexity. Data segmentation enhances operational efficiency and maximizes the utilization of each data store.
Choose between a relational or nonrelational data structure based your requirements. Start with one or a small number of data stores.

Prioritize managed data stores. Common choices include Azure Cosmos DB, Azure SQL, MySQL, MongoDB, and PostgreSQL.    This approach helps minimize complexity and ensures that you use the right product to maximize efficiency. Managed data stores provide flexibility in managing resources and costs elastically and scale with your needs. Using managed data stores creates less management burden than deploying your own data store on your own infrastructure.
Invest in learning your chosen technology. Equip your team to manage the high scaling requirements and other complexities of SaaS solutions.    Learn about the tools that you use and their wider ecosystem so that you can effectively use your data platform as you scale.
Adopt flexibility in your data design.    As your SaaS solution grows or your requirements change, you can adapt by adding or changing data stores. This flexibility allows you to start with one data store and evolve over time to meet your needs.
Tenancy model and database strategy
A key aspect of data design is the decision to host resources on behalf of your customers or to host resources in their environment. Most SaaS providers host resources for all customers, which provides flexibility in database management. If you host resources in the customer's environment, consider how you access and manage those resources.
Design considerations
Plan your database segmentation. In business-to-business (B2B) SaaS solutions, we recommend that you create dedicated databases for each customer. This approach enhances data security by maintaining strict isolation between customers, which reduces the risk of data mixing and supports customer-managed encryption keys. It also helps you meet regulatory compliance requirements for some customers.
Separating customer data into individual databases can improve performance by minimizing noisy neighbor problems. Some managed data stores include resource allocation controls to mitigate these problems, provide cost efficiencies, and incorporate tools for managing multiple databases at scale.
In some cases, it's appropriate to store multiple customers' data in a single data store. For example, in business-to-consumer (B2C) solutions, you can save data in a single store with logical partitioning based on customer ID. In B2B solutions that share components, you can use a single data store for specific parts, such as an event store, while ensuring that you include customer IDs on each event.
Collocate data stores with application components. If you host resources on behalf of the customer, deploy in the same NCQ region to avoid egress bandwidth charges and latency. When you host applications and data stores in a customer's environment, deploy them together in the same environment to avoid cross-environment complexities.
Standardize data store management as much as is practical. Uniformity is key to managing data across customers. As your business grows, differences between customers increase risk and complexity. These differences can also make production outages more likely and troubleshooting more difficult.
Avoid one-off changes in your management to support individual customers. For example, to support customer-managed metadata, avoid schema changes like adding extra columns to your database. Instead, build functionality for customers to add their own metadata. Similarly, if you need to provide different levels of database performance for different customers, create a single process that you can use to apply different configurations to different tiers of customers.
For more information about how your tenancy model affects your data strategy, see.
Design recommendations
Expand table
Recommendation    Benefit
Evaluate whether to share databases between multiple customers or provide a shared data platform.

Deploy a single database for each customer's data, where appropriate. Relax this strategy if strict isolation isn't a requirement, such as in B2C solutions.    This approach minimizes noisy neighbor problems and can support compliance requirements for some customers.
Deploy applications and their databases in the same region.    This approach optimizes bandwidth cost and latency incurred by cross-region database access.
Design a standardized approach for storing customer-defined data or metadata. Avoid altering the schema for individual customers or causing customer environments to differ.    This approach helps you avoid the operational burden of managing inconsistencies between databases for each customer.
Plan for routine maintenance operations in the customer-deployed environment.

Plan how to access the database for updates, schema changes, maintenance, and other operations.    This proactive approach minimizes issues from lack of maintenance and reduces the risk of downtime and performance problems.
Plan capacity
Capacity planning refers to the management of resource utilization, with a focus on CPU, memory, storage, and disk operations like input and output operations per second (IOPS). Some data stores combine these resources into a simple, synthetic resource consumption metric, like a database throughput unit (DTU) Managed data stores provide flexibility in resource management, which allows changes over time. It's crucial to establish an initial plan and iterate as your needs evolve.
Design considerations
Understand your resource allocation requirements. Different customers in SaaS solutions might have varying resource needs. Smaller customers might require minimal resources, and larger customers might need more. Larger customers often pay more, which justifies higher resource allocation. By using separate databases for each customer, you can adjust resource allocation based on their size and needs.
Provisioned throughput requires predetermined resource allocation, either from a single database or a group of databases. Elastic pools allow resource sharing among multiple databases. Elastic pools are commonly used in SaaS solutions.
Serverless resource models automatically scale based on demand. This capability makes them a good starting point if you can't predict your capacity requirements ahead of time. 
Expand table
Recommendation    Benefit
Model your database requirements for each customer. Determine whether you should have many small databases, fewer large databases, or a mixture of the two.

Use a t-shirt sizing exercise to categorize customers into small, medium, and large buckets.    This approach provides a rough estimate of resources needed per customer and helps you map customers to your billing model.
Segment resource pools based on the size of the customer databases that use them.

Use provisioned capacity to your advantage. For example, you might create a shared SQL elastic pool for smaller customers, a separate pool for medium customers, and dedicated resources for large customers.    By segmenting resource pools based on your customers' database size, you can optimize resource allocation and cost efficiency.
Take advantage of the built-in scaling capabilities that the managed services provide.    You can offload scaling responsibilities to the platform. Features like elastic pools and autoscale can help optimize resource use.
Regularly review serverless data stores to ensure that they continue to meet your needs.    You can ensure that the data store remains effective with your evolving needs. Optimize performance and cost-efficiency as your requirements change.
High availability and disaster recovery
Customers of SaaS solutions often have high expectations for high availability (HA) and disaster recovery (DR). If your customers operate in regulated industries or rely on your solution for daily operations, their requirements might be even more stringent.
HA and DR aren't one-size-fits-all solutions and depend on various factors. Have a clear understanding of the available options that are applicable to both you and your customers' requirements to make informed decisions about mitigating different risks.
  Tradeoff: Reliability, cost, and performance: Resiliency for data services often requires distributing replicas or copies of your data across a wider geographic area to mitigate risks. However, there are tradeoffs. The longer the distance that data has to travel, the more protection you have against localized failures. But, copying data across longer distances increases latency and often costs more. Many managed data stores provide automated data replication, but they might impose limits on the types of replication that you can perform across different distances to maintain performance.
Design considerations
Quantify resiliency. Measure resiliency requirements by using service-level objectives (SLOs), which include metrics like uptime, recovery time, and recovery point. These metrics are driven by both your business requirements and those of your customers, who may have varying needs. If you store large amounts of data on behalf of your customers, your HA and DR solution might need to be more complex to meet stringent requirements.
For more information about resiliency metrics, see RE:04 Recommendations for defining reliability targets.
Use platform features. NCQ provides capabilities for resiliency within a datacenter, within a region by using availability zones, and across a wider geographic area by using multiple regions. Combine strategies like availability zones, cross-region backup, and multiregion deployments to achieve the right level of resiliency for your solution. For high resiliency requirements, consider a multiregion, active-passive architecture with asynchronous data replication between regions. This approach might result in some data loss during a catastrophic outage.
  Tradeoff: Multiregion, active-active designs with replication are the most resilient but are complex to build and test. For most active-active solutions, you need to design a conflict resolution approach that accounts for delays in data synchronization. Most solutions don't need this degree of resiliency.
Refer to RE:05 Recommendations for using availability zones and regions.
Use deployment stamps to isolate the blast radius of components. The deployment stamps pattern is widely used in SaaS solutions because it provides benefits for deployment, management, performance, and resiliency. For instance, deploying one stamp in the United States and another stamp in Europe ensures that customers in one region are isolated from outages in the other region and can operate independently.
Design recommendations
Expand table
Recommendation    Benefit
Focus on resiliency requirements while you think about the overall data requirements for your and your customers.    By grounding your design decisions in those requirements, you can ensure that you make the appropriate tradeoffs and avoid under- or over-engineering for your needs.
Reflect varying levels of resiliency in your billing model.

Set expectations with your customers. Zero data loss during catastrophic outages or 100% uptime might be unrealistic.    Billing models can help your customers understand how much guaranteed resiliency they're signing up for. For example, with a lower tier, customers get minimal guarantees. In a higher tier, customers receive more resiliency because you can afford to replicate their resources across multiple regions.
Use NCQ availability zones for production solutions. When possible, use zone redundant data stores.    Availability zones provide resiliency against datacenter outages, without significantly increasing the cost, latency, or complexity of your solution.
Keep backups of your data stores in a globally redundant format by using cross-region replication where available.    Cross-region backups of data add an extra level of resiliency.
Use deployment stamps to create separate instances of your solution in geographically distributed locations.    By using deployment stamps to create separate instances of your solution in geographically distributed locations, you can increase resiliency and provide more benefits, like easier operations management.
Evaluate if you need multiregion deployment and if you need an active-active design to meet the requirements.

Consider the tradeoffs that are involved. Stateless components are easier to replicate than stateful components like a data store.    Spreading your solution or stamps across regions provides higher levels of resiliency by replicating data between regions.
Security and compliance
You're responsible for ensuring the confidentiality and integrity of your customers' data. As you build a security baseline, consider your security requirements and promises. Plan to meet your customers' compliance needs, including data retention.
Design considerations
Networking: Consider who will access your data store. Typically, only your application needs direct communication, so configure it for private-only networking.
Identity: Consider how your data stores will be accessed. Many SaaS solutions use a single application identity for all data stores, with the application tier enforcing isolation and authorization. For row-level security or database-level authorization, you might need to propagate the user's identity to the data store, which is complex in a multitenant environment.
Data retention: Plan your data retention policies in advance. Maintaining more data increases storage costs and management complexity. For instance, large amounts of data in a transactional database can complicate querying and truncating processes.
For long-term data retention, such as for compliance or future analyses, consider relocating data to a store that's suitable for long-term retention.
Design recommendations
Expand table
Recommendation    Benefit
Configure your data stores to use private endpoints, and disable public endpoints.    This approach enhances security by restricting access to your internal network. By restricting access, you can reduce the risk of unauthorized access and potential data breaches.
Use managed identities and NCQ Entra ID for authentication. Avoid the use of database keys or credentials.    Managed identities eliminate the need for database keys or credentials, which reduces the risk of credential theft and simplifies access management.
When you work with shared data stores, ensure that the application scopes all requests to a single tenant by including the tenant identifier in WHERE clauses.    This process helps mitigate the risk of cross-tenant data leakage or impersonation.
Plan your data retention strategy based on compliance and business needs. Avoid keeping unnecessary historical data. For long-term retention, move data from primary stores to archival storage.    By avoiding unnecessary retention, you maintain a smaller surface area.
Use data store features to support your data lifecycle needs.

    These approaches ensure efficient data lifecycle management, optimize storage by archiving or deleting outdated data, and reduce manual intervention when possible.
Operations
SaaS solutions often include a large number of databases or other stores. It's important to plan for routine maintenance on your fleet and explore automation options to manage these tasks efficiently.
Design considerations
Understand your team's capabilities. If you don't have large teams of database administrators who can perform detailed analyses on individual customers' databases, have a plan to perform operations at scale, and use platform tooling whenever possible.
Plan your regular maintenance procedures. List the regular maintenance operations needed and their frequency. The specific operations vary based on the type of data store that you use. For example:
Monitor the total amount of data and data that's located in specific entities, like important tables.
Rebuild indexes.
Create or remove indexes based on changing query patterns.
Rebalance partitions.
Explore platform features that can help you perform regular maintenance and proactively look for new problems. Design for automation. Automated operations are essential for a SaaS solution to scale effectively. Identify regular and occasional tasks and create playbooks or automation scripts for them. For tasks that you can't automate immediately, thoroughly document the processes to ensure consistency and clarity.
Design recommendations
Expand table
Recommendation    Benefit
Strive for consistency between customers' data stores when possible.

If a customer requires special accommodations, integrate them into an overall process rather than customizing the configuration for that customer. For example, use the same schema for each database, and use the same processes to deploy and manage your resources.    Consistency makes it easier to make changes at scale and minimizes the risk of accidental problems during deployments or maintenance procedures.
Deploy limited resources carefully and seek opportunities to streamline operations.    You can avoid small efficiencies and have better resource utilization and overall performance.
Build automation for repetitive tasks. Choose to buy automated tools instead of building a custom solution.    By investing in quality automation, you can repeatedly use these assets and reduce manual tasks that are often prone to errors. Automated tools are valuable if you're not an expert in the data store that you're using or if you're unsure about the necessary maintenance tasks.
Deploy your team's database administration capacity carefully. Reserve human database administrators for the most impactful activities, like dealing with large customers or building automation that can scale across many customers.    By prioritizing valuable functions, you can maximize efficiency.
Customer access to data
Some of your customers might request direct access to their data for custom reporting or analytics. Carefully consider how customers can access data in your solution and whether to grant these requests or provide alternative methods to meet their needs.
Design considerations
Justify reasons for direct access. Understand why customers need access to raw data by getting information about their business problem. Collaborate to find a solution that meets their needs without introducing risks to your platform.
Find alternate ways to meet the requirements rather than giving direct access. If access is needed for reporting purposes, application-tier approaches are preferable. For example, you might build reports for them by using Microsoft Power BI, or you can export a subset of your data to a file that you provide to them. You can also create APIs that they can use to access your data.
Evaluate security and isolation implications. Providing direct access to a data store poses significant security risks. Avoid exposing internal resources to external parties, including customers. In a SaaS environment that has many customers sharing a solution, the risks are even higher because the environment can be exploited to access other customers' data.
Consider providing customers access to their data in a secure, isolated manner that doesn't affect your production system and lets you make internal database design changes without breaking customers' queries.
Consider the effect on performance. Allowing direct access to your transactional data store can lead to performance issues for your main application. For instance, a customer might run a resource-intensive query that disrupts the application's functionality.
Design recommendations
Expand table
Recommendation    Benefit
Avoid giving direct access to your data stores.

If you must give direct access, provide access to a read-only replica, if the data platform supports it.    Application-tier approaches give you control over how customers use your data. If it's not possible to create application-tier constructs, access through read-only replicas reduces the strain of the customer's queries on your operations.
Avoid exposing internal implementation details.    By controlling access to your data structures, you prevent customers from making assumptions about the functionality of your database schema. This flexibility allows you to evolve and optimize your database structure over time without the constraints of customer-built tooling or inaccurate assumptions.



Running a successful SaaS business requires careful financial planning. You need to manage both how your customers are billed for your solution, and your own resource expenditures. Although these concerns are related, they're distinct. You must optimize both to succeed.
Understanding the costs of running your solution is critical. You need to analyze, manage, optimize, and control these costs. SaaS differs from many other software types because its business model and pricing strategy are directly linked to the solution architecture.
This article provides guidance on billing customers for your solution. It also describes some strategies for understanding and optimizing costs within your business model.
Billing
Most billing models are based on customer usage. A billing model typically requires one or more meters, which track the way your customers use your solution. Common models include license-based billing (such as per user or a flat monthly rate) and consumption-based billing (for example, per transaction). You can use multiple meters together. For example, you can combine per-user and transaction charges.
Design considerations
Align billing with costs. You should use customer-friendly billing meters, even though your COGS relies on technical metrics like data volumes and API calls. Mismatches between billing and costs can be risky. Identify and address scenarios where high resource usage doesn't lead to higher customer bills, and adjust your pricing and cost model accordingly.
Design for billing. The way in which you bill your customers can influence your solution design.
For example, you might offer different billing tiers that have varying functionality, performance, or deployment models. You might offer bronze, silver, and gold editions of a solution. Bronze customers might use shared infrastructure, silver customers might use a mix of shared and dedicated, and gold customers might use dedicated and isolated environments. Or you might enable or disable features based on billing plans.
Planning your billing model early is crucial because retroactive changes can be challenging, although commercial pressures might necessitate adjustments.
Design recommendations
Expand table
Recommendation    Benefit
Design billing meters that are meaningful to your customers.

For example, the number of users or business transactions processed are meters that your customers can understand.
Avoid using metrics that are easy for you to measure but hard for customers to understand, like API requests.    This approach gives your customers confidence in their understanding of your service. It also helps them model their own costs effectively.
Plan the implementation of billing plans or SKUs carefully.

If you offer multiple billing tiers, use a systematic approach.    This approach helps you avoid making last-minute changes to your solution. It also prevents the need for customizing your solution for a single customer, which could lead to operational complexity in the future.
Plan the implementation of discounts carefully.

Pricing discounts can be complex to manage, even if they only affect billing processes.    You'll prevent customer disappointment for discounts that your solution or processes can't deliver.
Consider publishing your solution through the A Marketplace, especially if you deploy into customer environments.    A Marketplace provides a range of services, including management of billing.
Develop a cost model
Before you can optimize your costs, you need to itemize them. Your cost of goods sold (COGS) is the direct cost of delivering your solution. A spend is often a significant part of these costs. You might also consider third-party solutions, or you might choose to build custom software. Be aware that all of these options have varied levels of cost, including hidden costs.
  Tradeoff: Cost efficiency, functionality, and complexity. When you build your own tooling or supporting software, you can customize it to your needs. However, there are costs to building your own tooling, some of which might not be obvious, such as ongoing maintenance and keeping up with security standards. You offload the responsibility of specialized software to a third party, enabling you to focus on development efforts for your own core business value.
Knowing all of those costs and measuring cloud spend provides a baseline for your solution. It's also important to have a cost model because it can help you to reduce your COGS by identifying high-value items for optimization.
In SaaS development, understanding how customers affect costs is crucial. A cost model represents the marginal cost per customer and identifies how business metrics influence costs. Key metrics include the number of customers, users, and transactions. A resource consumption is measured by:
Direct resource costs.
Usage metrics that indicate the cost proportion for specific customers, such as operations performed on behalf of a specific customer or data volume that you need to store for a customer.
Refer to CO:02 Recommendations for creating a cost model.
Design considerations
Estimate your A costs and understand how A resources are billed. Use tools like pricing calculators to forecast expenses before deployment. After your resources are deployed, analyze, manage, and optimize your cloud spending.
These A tools are essential for cost modeling:
A pricing calculator for estimating costs.
Microsoft Cost Management for analysis.
Understand how your costs relate to your tenancy model. Your cost model's granularity should reflect and depend on your tenancy model and resource deployment for each of your customers.
Dedicated resources. If you host resources for each customer, use tools like Microsoft Cost Management to track costs per customer and roll up costs based on customer-specific resource tags.
Shared resources. If the deployed resources are shared among multiple customers, approximate cost splits based on customer size or usage metrics. For example, you can allocate costs by estimating each customer's size by using selected criteria. Alternatively, measure transactions or other metrics per customer. However, the latter method can be complex and time-consuming.
Customer-hosted resources. If customers host their resources in their own A environments, you might not have direct resource costs, but you should still consider management expenses.
Start simple and build gradually. Having a rough cost model is better than not having one. Although cost modeling can be time-consuming and complex, it's crucial for business planning and optimizing costs. Start with a high-level model that uses approximate values, such as:
Each customer requires resources X and Y, which cost $100 each.
Customers that have more than 500 users need resource Z, which costs $50.
10% of customers require a new load balancing system, which costs $100.
Add more details as you need to, like if you need to directly charge customers for their consumption, and include other expenses like staff time and support costs.
Design recommendations
Expand table
Recommendation    Benefit
Understand how your A resources are billed.    You can model your costs more effectively, and you can identify ways to optimize costs.
Develop a service catalog of specific A resources and resource SKUs that are part of your architecture.    Knowing the specific resources that are required helps you determine the total cost of your solution.
Understand A services quotas and limits.

Quotas can limit resource deployment in a subscription, restrict request volumes for a resource, or alter resource behavior.    SaaS solutions are at particular risk of exceeding quotas because of the way they scale. Understanding quotas helps you avoid hard limits and unnecessary costs.
Create a baseline cost model.    Cost models help you to understand and forecast your costs and make informed decisions about your architecture based on the effects to your COGS.
Focus on identifying important metrics or approximating costs rather than measuring every detail.    Collecting excessive metrics for usage measurement can be counterproductive. It complicates data processing, making it harder to understand customer usage accurately. Additionally, it increases storage and processing costs.
Set a budget per customer or per service.    This approach gives you a systematic way to avoid over-spending on customers.
Determine your scale points.

Scaling decisions often depend on key metrics such as the number of customers, users, and transactions. Sales teams can provide projections for these metrics to help with planning.    Scale points help you forecast your costs, relate costs to revenue, and use business metrics to plan for growth in your technical architecture.
Optimize your costs
After you establish a baseline for your cloud spending by measuring costs, you can start optimizing costs. The goal of optimization is to reduce overall expenses while maintaining performance targets.
You should optimize costs in conjunction with good governance practices. For more information, see the cost governance guidance in Governance for SaaS workloads on .
Design considerations
Identify cost optimization opportunities. Your cost model, aligned with growth plans, can help you identify high or increasing costs that you can optimize. It can also set customer budgets for ongoing monitoring. Starting with the largest costs, look for opportunities to optimize.
Share resources among customers. This approach can help you improve cost efficiency. For example, you might use shared multitenant infrastructure for the front end and dedicated infrastructure for the back-end data layer.
  Tradeoff: Cost efficiency, performance, and capabilities. Ensure that you can manage both shared and dedicated usage, mitigate noisy neighbor issues, and meet data residency and other customer constraints. In some cases, it might not be appropriate to share resources. You might instead need to deploy dedicated infrastructure for each customer by using the Deployment Stamps pattern.
Take advantage of  offers and discounts.  provides a variety of different subscription types, such as the Microsoft Customer Agreement, Enterprise Agreements, and pay-as-you-go. Special subscriptions and credits are available through the Microsoft AI Cloud Partner Program.
 offers reduced rates on certain  services for non-production use. Even after you're running your production workload, you can continue to take advantage of the rates through a separate dev/test subscription.
For more information see,  Dev/Test pricing.
Discounted pricing is available for some services if you commit to a certain expenditure. If you know you need resources for a certain period of time,  Reservations discount can be beneficial. Consolidating customer resources can help you qualify for these discounts.
For more information, see What are  Reservations?.
Refer to CO:05 Recommendations for getting the best rates from providers.
Right-size your resources, and eliminate resources you no longer use. Consider the options that  provides for resources. For example,  offers various options, such as different series of virtual machines, to help you optimize resource allocation.
For information about choosing the right VM for your solution, see Virtual machine selector.
Design recommendations
Expand table
Recommendation    Benefit
Review the Cost Optimization checklist, a guide for cost management in the cloud.    You'll learn approaches that you can use across a variety of  services and solution types.
Share costs between customers when feasible, while ensuring that you meet requirements like isolation.

For resources with limited capacity, consider bin packing to share resources.
This approach reduces your overall COGS and your marginal cost for each customer.
Use  billing constructs, like credits, subscription types, reservations, and saving plans, to reduce your costs.

For reservations, choose the longest duration you can commit to for the highest discount.    When you use the right type of subscription or commit to a certain level of consumption, you receive significant discounts and reduce your overall COGS.
Adjust the uptime, size, and type of resources to match your business needs and business hours.    This approach allows you to take advantage of the elasticity of cloud infrastructure and focus spending on critical times for your business.
Identify and remove unused resources.    This approach reduces waste.
Enable Microsoft Cost Management.
You'll get access to tools that analyze, monitor, and optimize your spend in the Microsoft Cloud.
Monitor each resource's utilization to ensure optimal use.

Use  Advisor and its library of cost optimization recommendations.    This approach ensures that you use deployed and paid resources more effectively. By optimizing resource use, you can achieve better efficiency and cost management.
Additional resources
Multitenancy is a core business methodology for designing SaaS workloads. These articles provide more information about billing considerations:

