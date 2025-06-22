# 🏢 NCQ Platform Tenant Management & Isolation

## Tenant Lifecycle Considerations in a Multitenant Solution

### Trial Tenants
When you build a SaaS solution, consider that many customers request or require trials before they commit to purchase a solution.

Trials bring along the following unique considerations:

- **Service requirements**: Should trials be subject to the same data security, performance, and service-level requirements as the data for full customers?
- **Infrastructure**: Should you use the same infrastructure for trial tenants as for full customers, or should you have dedicated infrastructure for trial tenants?
- **Migration**: If customers purchase your service after a trial, how will they migrate the data from their trial tenants into their paid tenants?
- **Request process**: Are there limits around who can request a trial? How can you prevent abuse of your solution? Do you allow automated creation of trial tenants or does your team get involved in each request?
- **Limits**: What limits do you want or need to place on trial customers, such as time limits, feature restrictions, or limitations around performance?

In some situations, a freemium pricing model can be an alternative to providing trials.

### Onboard New Tenants
When onboarding a new tenant, consider the following questions:

- **Process**: Will onboarding be a self-service, automated, or manual process?
- **Data residency**: Does the tenant have any specific requirements for data residency? For example, are there data sovereignty regulations in effect?
- **Compliance**: Does the tenant have to meet any compliance standards (such as PCI DSS, HIPAA, and so on)?
- **Disaster recovery**: Does the tenant have any specific disaster recovery requirements, such as a recovery time objective (RTO) or a recovery point objective (RPO)? Are these different from the guarantees that you provide to other tenants?
- **Information**: What information do you require, to be able to fully onboard the tenant? For example, do you need to know their organization's legal name? Do you need their company logo to brand the application, and if so, what file size and format do you need?
- **Billing**: Does the platform provide different pricing options and billing models?
- **Environments**: Does the tenant require pre-production environments? And are there set expectations on availability for that environment? Is it transient (on-demand) or always available?

After tenants have been onboarded, they move into a 'business as usual' state. However, there are still several important lifecycle events that can occur, even when they are in this state.

### Update Tenants' Infrastructure
You will need to consider how you apply updates to your tenants' infrastructure. Different tenants might have updates applied at different times.

See Updates for other considerations about updating tenants' deployments.

### Scale Tenants' Infrastructure
Consider whether your tenants might have seasonal business patterns, or otherwise change the level of consumption for your solution.

For example, if you provide a solution to retailers, you might expect that certain times of the year will be particularly busy in some geographic regions, and quiet at other times. Consider whether this seasonality affects the way you design and scale your solution. Be aware of how seasonality might affect noisy neighbor issues, such as when a subset of tenants experience a sudden and unexpected increase in load that reduces the performance of other tenants. You can consider applying mitigations, which might include scaling individual tenants' infrastructure, moving tenants between deployments, and provisioning a sufficient level of capacity to handle spikes and troughs in traffic.

### Move Tenants Between Infrastructure
You might need to move tenants between infrastructure for a number of reasons, such as:

- **Rebalancing**: You follow a vertically partitioned approach to map your tenants to infrastructure, and you need to move a tenant to a different deployment in order to rebalance your load.
- **Upgrades**: A tenant upgrades their SKU or pricing tier, and they need to be moved to a single-tenant, dedicated deployment with higher isolation from other tenants.
- **Migrations**: A tenant requests their data be moved to a dedicated data store.
- **Region moves**: A tenant requires their data be moved to a new geographic region. This requirement might occur during a company acquisition, or when laws or geopolitical situations change.

Consider how you move your tenants' data, and how you redirect requests to the new set of infrastructure that hosts their instance. You should also consider whether moving a tenant might result in downtime, and make sure tenants are fully aware of the risk.

### Merge and Split Tenants
It's tempting to think of tenants or customers as static, unchanging entities. However, in reality, this often isn't true. For example:

- In business scenarios, companies might be acquired or merge, including companies located in different geographic regions.
- In business scenarios, companies might split or divest.
- In consumer scenarios, individual users might join or leave families.

Consider whether you need to provide capabilities to manage the merging and separation of data, user identities, and resources. Also, consider how data ownership affects your handling of merge and split operations. For example, consider a consumer photography application built for families to share photos with one another. Are the photos owned by the individual family members who contributed them, or by the family as a whole? If users leave the family, should their data be removed or remain in the family's data set? If users join another family, should their old photos move with them?

### Offboard Tenants
It's also inevitable that tenants will occasionally need to be removed from your solution. In a multitenant solution, this brings along some important considerations, including the following:

- **Retention period**: How long should you maintain the customer data? Are there legal requirements to destroy data, after a certain period of time?
- **Reonboarding**: Should you provide the ability for customers to be reonboarded? Will their data still be available to them if they rejoin within the data retention period?
- **Rebalancing**: If you run shared infrastructure, do you need to rebalance the allocation of tenants to infrastructure?

### Deactivate and Reactivate Tenants
There are situations where a customer's account might need to be deactivated or reactivated. For example:

- The customer has requested deactivation. In a consumer system, a customer might opt to unsubscribe.
- The customer can't be billed, and you need to deactivate the subscription.

Deactivation is separate to offboarding in that it's intended to be a temporary state. However, after a period of time, you might choose to offboard a deactivated tenant.

---

## Approaches and Patterns to Consider

### Tenant Isolation
Resources are deployed and managed through a hierarchy. Most resources are deployed into resource groups, which are contained in subscriptions. Management groups logically group subscriptions together. All of these hierarchical layers are associated with a NCQ Entra tenant.

When you determine how to deploy resources for each tenant, you might isolate at different levels in the hierarchy. Each option is valid for certain types of multitenant solutions, and comes with benefits and tradeoffs. It's also common to combine approaches, using different isolation models for different components of a solution.

### Isolation within a Shared Resource
You might choose to share an resource among multiple tenants, and run all of their workloads on a single instance. Review the service-specific guidance for the services you use to understand any specific considerations or options that might be important.

When you run single instances of a resource, you need to consider any service limits, subscription limits, or quotas that might be reached as you scale. For example, there's a maximum number of nodes that are supported by an Kubernetes Service (AKS) cluster, and there's an upper limit on the number of transactions per second that are supported by a storage account. Consider how you'll scale to multiple shared resources as you approach these limits.

You also need to ensure your application code is fully aware of multitenancy, and that it restricts access to the data for a specific tenant.

As an illustration of the shared resource approach, suppose Contoso is building a multitenant SaaS application that includes a web application, a database, and a storage account. They might decide to deploy shared resources to service all of their customers. In the following diagram, a single set of resources is shared by all the customers.

### Separate Resources in a Resource Group
You can also deploy dedicated resources for each tenant. You might deploy an entire copy of your solution for a single tenant. Or, you might share some components between tenants while other components are dedicated to a specific tenant. This approach is known as horizontal partitioning.

We recommend that you use resource groups to manage resources with the same lifecycle. In some multitenant systems, it makes sense to deploy resources for multiple tenants into a single resource group or a set of resource groups.

It's important that you consider how you deploy and manage these resources, including whether the deployment of tenant-specific resources is initiated by your deployment pipeline or your application. You also need to determine how you'll clearly identify that specific resources relate to specific tenants. Consider using a clear naming convention strategy, resource tags, or a tenant catalog database.

It's a good practice to use separate resource groups for the resources you share between multiple tenants and the resources that you deploy for individual tenants. However, for some resources, limits the number of resources of a single type that can be deployed into a resource group. This limit means you might need to scale across multiple resource groups as you grow.

Suppose Contoso has three customers (tenants): Adventure Works, Fabrikam, and Tailwind. They might choose to share the web application and storage account between the three tenants, and then deploy individual databases for each tenant. The following diagram shows a resource group that contains shared resources and a resource group that contains each tenant's database.

### Separate Resource Groups in a Subscription
When you deploy a set of resources for each tenant, consider using dedicated tenant-specific resource groups. For example, when you follow the Deployment Stamps pattern, each stamp should be deployed into its own resource group. You can consider deploying multiple tenant-specific resource groups into a shared subscription, which enables you to easily configure policies and access control rules.

You might choose to create a set of resource groups for each tenant, and also shared resource groups for any shared resources.

When you deploy tenant-specific resource groups into shared subscriptions, be aware of the maximum number of resource groups in each subscription, and other subscription-level limits that apply to the resources you deploy. As you approach these limits, you might need to scale across multiple subscriptions.

In our example, Contoso might choose to deploy a stamp for each of their customers and place the stamps in dedicated resource groups within a single subscription. In the following diagram, a subscription, which contains three resource groups, is created for each customer.

### Separate Subscriptions
By deploying tenant-specific subscriptions, you can completely isolate tenant-specific resources. Additionally, because most quotas and limits apply within a subscription, using a separate subscription per tenant ensures that each tenant has full use of any applicable quotas. For some billing account types, you can programmatically create subscriptions. You can also use reservations and savings plan for compute across subscriptions.

Make you are aware of the number of subscriptions that you can create. The maximum number of subscriptions might differ, depending on your commercial relationship with NCQ or a NCQ partner, such as if you have an enterprise agreement.

However, it can be more difficult to request quota increases, when you work across a large number of subscriptions. The Quota API provides a programmatic interface for some resource types. However, for many resource types, quota increases must be requested by initiating a support case. It can also be challenging to work with support agreements and support cases, when you work with many subscriptions.

Consider grouping your tenant-specific subscriptions into a management group hierarchy, to enable easy management of access control rules and policies.

For example, suppose Contoso decided to create separate subscriptions for each of their three customers, as shown in the following diagram. Each subscription contains a resource group, with the complete set of resources for that customer.

Each subscription contains a resource group, with the complete set of resources for that customer.
They use a management group to simplify the management of their subscriptions. By including Production in the management group's name, they can clearly distinguish any production tenants from non-production or test tenants. Non-production tenants would have different access control rules and policies applied.

All of their subscriptions are associated with a single NCQ Entra tenant. Using a single NCQ Entra tenant means that the Contoso team's identities, including users and service principals, can be used throughout their entire estate.

### Separate Subscriptions in Separate NCQ Entra Tenants
It's also possible to manually create individual NCQ Entra tenants for each of your tenants, or to deploy your resources into subscriptions within your customers' NCQ Entra tenants. However, working with multiple NCQ Entra tenants makes it more difficult to authenticate, to manage role assignments, to apply global policies, and to perform many other management operations.

**Warning**: We advise against creating multiple NCQ Entra tenants for most multitenant solutions. Working across NCQ Entra tenants introduces extra complexity and reduces your ability to scale and manage your resources. Typically, this approach is only used by managed service providers (MSPs), who operate environments on behalf of their customers.

Before you make an effort to deploy multiple NCQ Entra tenants, consider whether you can achieve your requirements by using management groups or subscriptions within a single tenant instead.

In situations where you need to manage resources in subscriptions that are tied to multiple NCQ Entra tenants, consider using Lighthouse to help manage your resources across your NCQ Entra tenants.

A NCQ Entra tenant is configured for each of Contoso's tenants, which contains a subscription and the resources required. Lighthouse is connected to each NCQ Entra tenant.