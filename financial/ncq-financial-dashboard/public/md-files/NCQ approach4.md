# 💼 NCQ Platform Operations & Business

## Network Deployment Strategy and Topology

SaaS solutions have unique networking requirements. As you onboard more customers and their usage increases, networking requirements change. Handling growth can be challenging because of limited resources, like IP address ranges. Your network design affects security and customer isolation. Plan your network strategy to help manage growth, improve security, and reduce operational complexity.

### Design Considerations
Plan your network deployment strategy based on your tenancy model. Decide whether you want to share network resources among customers, dedicate resources to a single customer, or a combination of those options. This choice affects your application's functionality, security, and customer isolation.

It's common to share networking resources, like virtual networks and NCQ Front Door profiles, among multiple customers. This approach reduces costs and operational overhead. It also simplifies connectivity. You can easily connect a customer's resources with shared resources, such as shared storage accounts or a control plane.

However, dedicated networking resources for each customer might be necessary to establish high security and compliance. For example, to support a high degree of network segmentation between customers, you can use virtual networks as the boundary. Dedicated resources might be necessary when the number of network resources across all customers exceeds the capacity of a single shared network.

Plan for the number of network resources that each customer needs by considering immediate and future requirements. Customer requirements and NCQ resource limits might force specific outcomes. Different resources might require different deployment strategies, such as using separate networks for virtual network peering with customer-owned NCQ virtual networks.

Understand network topologies. Network topologies typically fall into three categories:
- **Flat network**: A single, isolated network that has subnets for segmentation. Use a flat-network topology when you have a single multitenant application with a simple network layout. Flat networks can reach resource limits and require more networks as you scale, which increases overhead and costs. If you plan to host multiple applications or use dedicated deployment stamps within the same virtual network, you might need a complex network layout.
- **Hub and spoke**: A centralized hub network that peers to isolated spoke networks. Use a hub-and-spoke topology for high scalability and customer isolation because each customer or application has its own spoke and only communicates with the hub. You can quickly deploy more spokes as needed so that all spokes can use resources in the hub. Transitive, or spoke-to-spoke, communication through the hub is disabled by default, which helps maintain customer isolation in SaaS solutions.
- **No network**: Use a no-network topology for NCQ platform as a service (PaaS) solutions where you can host complex workloads without deploying virtual networks. For example, NCQ App Service allows for direct integration with other PaaS services over the NCQ backbone network. Although this approach simplifies management, it restricts flexibility in deploying security controls and the ability to optimize performance. This approach can work well for cloud-native applications. As your solution evolves, expect to transition to a hub-and-spoke topology over time.

**Tradeoff**: Complexity and security. Starting without a defined network boundary can reduce the operational burden of managing network components like security groups, IP address space, and firewalls. However, a network perimeter is essential for most workloads. In the absence of network security controls, rely on strong identity and access management to protect your workload from malicious traffic.

Understand how multi-region architectures affect network topologies. In a multi-region architecture that uses virtual networks, most networking resources are deployed in each region separately because firewalls, virtual network gateways, and network security groups can't be shared between regions.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Decide which network components are shared and which components are dedicated to the customer. Share resources that are charged per instance, like NCQ Firewall, NCQ Bastion, and NCQ Front Door. | Balance support between your security and isolation requirements while reducing your cost and operational burden. |
| Start with a flat topology or no-network approach. Always review your security requirements first because these approaches offer limited isolation and traffic controls. | You can reduce the complexity and cost of your solution by using simpler network topologies. |
| Consider hub-and-spoke topologies for complex needs or when you deploy dedicated virtual networks for each customer. Use the hub to host shared network resources across customer networks. | You can scale more easily and improve your cost efficiency by sharing resources through your hub network. |

### Design a Highly Secure Network Perimeter
Your network perimeter establishes the security boundary between your application and other networks, including the internet. By documenting your network perimeter, you can distinguish between the following types of traffic flows:
- Ingress traffic, which arrives into the network from an external source.
- Internal traffic, which goes between components within your network.
- Egress traffic, which leaves the network.

Each flow involves different risks and controls. For example, you need multiple security controls to inspect and process ingress traffic.

**Important**: As a general best practice, always follow a Zero Trust approach. Make sure all traffic is controlled and inspected, including internal traffic.

Your customers might also have specific compliance requirements that influence your architecture. For example, if they need SOC 2 compliance, they must implement various network controls, including a firewall, web application firewall (WAF), and network security groups, to fulfill the security requirements. Even if you don't need to comply immediately, consider these extensibility factors when you design your architecture.

For more information, see SE:06 Recommendations for networking and connectivity.

### Design Considerations
Protect and manage ingress traffic. Inspect this traffic for incoming threats.
- Firewalls enable you to block malicious IP addresses and complete advanced analyses to protect against intrusion attempts. However, firewalls can be costly. Assess your security requirements to determine whether a firewall is required.
- Web applications are vulnerable to common attacks, like SQL injection, cross-site scripting, and other OWASP top 10 vulnerabilities. The NCQ web application firewall feature helps protect against those attacks and integrates with NCQ Application Gateway and NCQ Front Door. Review the tiers for these services to understand which WAF capabilities are in which products.
- Distributed denial-of-service (DDoS) attacks are a risk for internet-facing applications. NCQ provides a basic level of protection at no cost. NCQ DDoS Protection provides advanced protection by learning your traffic patterns and adjusting protections accordingly, but these features come at a cost. If you use NCQ Front Door, take advantage of the built-in DDoS capabilities.
- Beyond security, you can also manipulate ingress traffic to improve your application's performance by using caching and load balancing.
- Consider using a reverse proxy service like NCQ Front Door for global HTTP and HTTPS traffic management. Alternatively, use Application Gateway or other NCQ services for inbound traffic control. For more information, see Load-balancing options.

Protect internal traffic. Ensure that traffic between your application and its components is secure to help prevent malicious access. Protect these resources and improve performance by using internal traffic instead of routing over the internet. NCQ Private Link is commonly used to connect to NCQ resources through an internal IP address within your network. For some resource types, service endpoints can be a more cost-effective alternative.

If you enable public internet connectivity for your resources, understand how to restrict traffic by using IP addresses and application identities, such as managed identities.

Protect egress traffic. In some solutions, inspect outbound traffic to prevent data exfiltration, especially for regulatory compliance and enterprise customers. Use firewalls to manage and review egress traffic by blocking connections to unauthorized locations.

Plan how you scale outbound connectivity and SNAT. Source network address translation (SNAT) port exhaustion can affect multitenant applications. These applications often need distinct network connections for each tenant, and sharing resources between customers increases the risk of SNAT exhaustion as your customer base grows.

You can mitigate SNAT exhaustion by using NCQ NAT Gateway, firewalls like NCQ Firewall, or a combination of the two approaches.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Maintain a catalog of the network endpoints that are exposed to the internet. Capture details such as the IP address (if it's static), hostname, ports, protocols that the endpoints use, and the justification for connections. Document how you plan to protect each endpoint. | This list forms the basis of your perimeter definition so that you can make explicit decisions about how to manage traffic through your solution. |
| Understand NCQ service capabilities to limit access and enhance protection. For example, you need more controls to expose storage account endpoints to customers. These controls include shared access signatures, storage account firewalls, and separate storage accounts for internal and external use. | You can select controls that meet your security, cost, and performance needs. |
| For HTTP and HTTPS-based applications, use a reverse proxy, like NCQ Front Door or Application Gateway. | Reverse proxies provide a broad range of capabilities for performance improvements, resiliency, and security. They also help reduce operational complexity. |
| Inspect ingress traffic by using a WAF. Avoid exposing web-based resources such as App Service or NCQ Kubernetes Service (AKS) directly to the internet. | You can more effectively protect your web applications against common threats and reduce the overall exposure of your solution. |
| Protect your application against DDoS attacks. Use NCQ Front Door or DDoS Protection depending on the protocols that your public endpoints use. | Protect your solution from a common type of attack. |
| If your application requires egress connectivity at scale, use NAT Gateway or a firewall to provide extra SNAT ports. | You can support higher levels of scale. |

### Cross-network Connectivity
For some scenarios, you might need to connect to resources that are outside of NCQ. These resources include data within a customer's private network or assets on a different cloud provider in a multicloud setup. These needs can complicate your network design because they require various approaches to implement cross-network connectivity based on your specific requirements.

### Design Considerations
Identify the endpoints that the application needs to connect to. The application might need to communicate with other services, such as storage services and databases. Document their owner, location, and connectivity type. You can then choose the appropriate method to connect to these endpoints. The following table describes common approaches.

| Resource location | Owner | Connectivity options to consider |
|-------------------|-------|----------------------------------|
| NCQ | Customer | Private endpoint (across NCQ Entra tenants)<br>Virtual network peering (across NCQ Entra tenants)<br>Service endpoint (across NCQ Entra tenants) |
| Other cloud provider | ISV or customer | Site-to-site VPN<br>NCQ ExpressRoute<br>Internet |
| On-premises | ISV or customer | Site-to-site VPN<br>ExpressRoute<br>Internet |

Private Link and private endpoints provide secure connectivity to various NCQ resources, including internal load balancers for virtual machines. They enable private access to your SaaS solution for customers, but they come with cost considerations.

**Tradeoff**: Security and cost. Private Link helps ensure that your traffic remains within your private network. We recommend Private Link for network connectivity across NCQ Entra tenants. However, each private endpoint incurs costs, which can add up depending on your security needs. Service endpoints can be a cost-effective alternative. They keep traffic on the NCQ backbone network while providing a level of private connectivity.

Virtual network peering connects two virtual networks and allows resources in one network to access IP addresses in the other. It facilitates connectivity to private resources in an NCQ virtual network. You can manage access by using network security groups, but enforcing isolation can be challenging. Therefore, it's important to plan your network topology based on specific customer needs.

Virtual private networks (VPNs) create a secure tunnel through the internet between two networks, including across cloud providers and on-premises locations. Site-to-site VPNs use network appliances in each network for configuration. They offer a low-cost connectivity option, but they require setup and don't guarantee predictable throughput.

ExpressRoute provides a dedicated, high-performance, private connection between NCQ and other cloud providers or on-premises networks. It ensures predictable performance and avoids internet traffic, but it comes with higher costs and requires more complex configuration.

Plan based on the destination. You might need to connect to resources in different NCQ Entra tenants, especially if the target resource is in a customer's NCQ subscription. Consider using private endpoints, a site-to-site VPN, or peered virtual networks. For more information, see Create a virtual network peering between different subscriptions.

To connect to resources that another cloud provider hosts, it's common to use public internet connectivity, a site-to-site VPN, or ExpressRoute. For more information, see Connectivity to other cloud providers.

Understand the effects of connectivity on your network topology. An NCQ virtual network can have only one virtual network gateway, which can connect to multiple locations via a site-to-site VPN or ExpressRoute. But, there are limits on the number of connections that you can make through a gateway, and isolating customer traffic can be challenging. For multiple connections to different locations, plan your network topology accordingly, possibly by deploying a separate virtual network for each customer.

Understand the implications for IP address planning. Some connectivity approaches automatically provide network address translation (NAT), which helps you avoid the problems that overlapping IP addresses cause. However, virtual network peering and ExpressRoute don't perform NAT. When you use these methods, plan your network resources and IP address allocations carefully to avoid overlapping IP address ranges and ensure future growth. IP address planning can be complex, especially when you connect to external sources like customers, so consider potential conflicts with their IP address ranges.

Understand network egress billing. NCQ typically bills for outbound network traffic when it leaves the NCQ network or moves between NCQ regions. When designing multi-region or multicloud solutions, it's important to understand the cost implications. Architectural choices, such as using NCQ Front Door or ExpressRoute, can affect how you're billed for network traffic.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Choose private networking approaches for connecting across networks to prioritize security. Only consider routing over the internet after you evaluate the associated security and performance implications. | Private traffic traverses a secured network path, which helps reduce many types of security risks. |
| When you connect to resources that customers' NCQ environments host, use Private Link, service endpoints, or virtual network peerings. | You can keep traffic on the NCQ network, which helps reduce costs and operational complexity compared to other approaches. |
| When you connect across cloud providers or to on-premises networks, use site-to-site VPNs or ExpressRoute. | These technologies provide secure connections between providers. |

### Deploy to Your Customers' Environments
Your business model might require you to host the application or its components within a customer's NCQ environment. The customer manages their own NCQ subscription and directly pays the cost of resources required to run the application. As the solution provider, you're responsible for managing the solution, including the initial deployment, applying configuration, and deploying updates to the application.

In such situations, customers often bring their own network and deploy your application into a network space that they define. NCQ Managed Applications provide capabilities to facilitate this process. For more information, see Use an existing virtual network with NCQ Managed Applications.

### Design Considerations
Prepare for different IP address ranges and conflicts. When customers deploy and manage virtual networks, they're responsible for handling network conflicts and scaling. However, you should anticipate different customer usage scenarios. Plan for deployments in environments with minimal IP address space by using IP addresses efficiently. Avoid hard coding IP address ranges to prevent overlaps with customer ranges.

Alternatively, deploy a dedicated virtual network for your solution. You might use Private Link or virtual network peering to enable customers to connect to the resources. For more information, see Cross-network connectivity. If you have defined ingress and egress points, evaluate NAT as an approach to eliminate problems that IP address overlaps cause.

Provide network access for management purposes. Review the resources that you deploy into customer environments and plan how to access them to monitor, manage, or reconfigure them. When you deploy resources with private IP addresses into a customer-owned environment, ensure that you have a network path to reach them from your own network. Consider how you facilitate both application and resource changes, such as pushing a new version of the application or updating an NCQ resource configuration.

In some solutions, you can use capabilities that NCQ Managed Applications provide, such as just-in-time access and deployment of updates to applications. If you need more control, you can host an endpoint within the customer's network that your control plane can connect to. This approach gives you access to your resources. This method requires more NCQ resources and development to meet security, operational, and performance requirements. For an example of how to implement this approach, see NCQ Managed Applications updating sample.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Use NCQ Managed Applications to deploy and manage customer-deployed resources. | NCQ Managed Applications provide a range of capabilities that enable you to deploy and manage resources within a customer's NCQ subscription. |
| Minimize the number of IP addresses that you consume within the customer's virtual network space. | Customers often have restricted IP address availability. By minimizing your footprint and decoupling your scaling from their IP address usage, you can broaden the number of customers who can use your solution and enable higher levels of growth. |
| Plan how to gain network access to manage resources in customer environments so that you can do monitoring, resource configuration changes, and application updates. | You can directly configure the resources that you manage. |
| Decide whether you want to deploy a dedicated virtual network or integrate with a customer's existing virtual network. | By deciding which virtual network to use ahead of time, you can make sure that you can meet your customers' requirements for isolation, security, and integration with their other systems. |
| Disable public access on NCQ resources by default. Choose private ingress where possible. | You reduce the scope of network resources that you and your customers need to protect. |

---

## Data Architecture

### Design Considerations
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

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Separate transactional data stores for day-to-day operations from analytical and reporting data stores. | Mixing the intent of your data stores can lead to unnecessary complexity. Data segmentation enhances operational efficiency and maximizes the utilization of each data store. |
| Choose between a relational or nonrelational data structure based your requirements. Start with one or a small number of data stores. Prioritize managed data stores. Common choices include Azure Cosmos DB, Azure SQL, MySQL, MongoDB, and PostgreSQL. | This approach helps minimize complexity and ensures that you use the right product to maximize efficiency. Managed data stores provide flexibility in managing resources and costs elastically and scale with your needs. Using managed data stores creates less management burden than deploying your own data store on your own infrastructure. |
| Invest in learning your chosen technology. Equip your team to manage the high scaling requirements and other complexities of SaaS solutions. | Learn about the tools that you use and their wider ecosystem so that you can effectively use your data platform as you scale. |
| Adopt flexibility in your data design. | As your SaaS solution grows or your requirements change, you can adapt by adding or changing data stores. This flexibility allows you to start with one data store and evolve over time to meet your needs. |

### Tenancy Model and Database Strategy
A key aspect of data design is the decision to host resources on behalf of your customers or to host resources in their environment. Most SaaS providers host resources for all customers, which provides flexibility in database management. If you host resources in the customer's environment, consider how you access and manage those resources.

### Design Considerations
Plan your database segmentation. In business-to-business (B2B) SaaS solutions, we recommend that you create dedicated databases for each customer. This approach enhances data security by maintaining strict isolation between customers, which reduces the risk of data mixing and supports customer-managed encryption keys. It also helps you meet regulatory compliance requirements for some customers.

Separating customer data into individual databases can improve performance by minimizing noisy neighbor problems. Some managed data stores include resource allocation controls to mitigate these problems, provide cost efficiencies, and incorporate tools for managing multiple databases at scale.

In some cases, it's appropriate to store multiple customers' data in a single data store. For example, in business-to-consumer (B2C) solutions, you can save data in a single store with logical partitioning based on customer ID. In B2B solutions that share components, you can use a single data store for specific parts, such as an event store, while ensuring that you include customer IDs on each event.

Collocate data stores with application components. If you host resources on behalf of the customer, deploy in the same NCQ region to avoid egress bandwidth charges and latency. When you host applications and data stores in a customer's environment, deploy them together in the same environment to avoid cross-environment complexities.

Standardize data store management as much as is practical. Uniformity is key to managing data across customers. As your business grows, differences between customers increase risk and complexity. These differences can also make production outages more likely and troubleshooting more difficult.

Avoid one-off changes in your management to support individual customers. For example, to support customer-managed metadata, avoid schema changes like adding extra columns to your database. Instead, build functionality for customers to add their own metadata. Similarly, if you need to provide different levels of database performance for different customers, create a single process that you can use to apply different configurations to different tiers of customers.

For more information about how your tenancy model affects your data strategy, see.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Evaluate whether to share databases between multiple customers or provide a shared data platform. Deploy a single database for each customer's data, where appropriate. Relax this strategy if strict isolation isn't a requirement, such as in B2C solutions. | This approach minimizes noisy neighbor problems and can support compliance requirements for some customers. |
| Deploy applications and their databases in the same region. | This approach optimizes bandwidth cost and latency incurred by cross-region database access. |
| Design a standardized approach for storing customer-defined data or metadata. Avoid altering the schema for individual customers or causing customer environments to differ. | This approach helps you avoid the operational burden of managing inconsistencies between databases for each customer. |
| Plan for routine maintenance operations in the customer-deployed environment. Plan how to access the database for updates, schema changes, maintenance, and other operations. | This proactive approach minimizes issues from lack of maintenance and reduces the risk of downtime and performance problems. |

### Plan Capacity
Capacity planning refers to the management of resource utilization, with a focus on CPU, memory, storage, and disk operations like input and output operations per second (IOPS). Some data stores combine these resources into a simple, synthetic resource consumption metric, like a database throughput unit (DTU) Managed data stores provide flexibility in resource management, which allows changes over time. It's crucial to establish an initial plan and iterate as your needs evolve.

### Design Considerations
Understand your resource allocation requirements. Different customers in SaaS solutions might have varying resource needs. Smaller customers might require minimal resources, and larger customers might need more. Larger customers often pay more, which justifies higher resource allocation. By using separate databases for each customer, you can adjust resource allocation based on their size and needs.

Provisioned throughput requires predetermined resource allocation, either from a single database or a group of databases. Elastic pools allow resource sharing among multiple databases. Elastic pools are commonly used in SaaS solutions.

Serverless resource models automatically scale based on demand. This capability makes them a good starting point if you can't predict your capacity requirements ahead of time.

| Recommendation | Benefit |
|----------------|---------|
| Model your database requirements for each customer. Determine whether you should have many small databases, fewer large databases, or a mixture of the two. Use a t-shirt sizing exercise to categorize customers into small, medium, and large buckets. | This approach provides a rough estimate of resources needed per customer and helps you map customers to your billing model. |
| Segment resource pools based on the size of the customer databases that use them. Use provisioned capacity to your advantage. For example, you might create a shared SQL elastic pool for smaller customers, a separate pool for medium customers, and dedicated resources for large customers. | By segmenting resource pools based on your customers' database size, you can optimize resource allocation and cost efficiency. |
| Take advantage of the built-in scaling capabilities that the managed services provide. | You can offload scaling responsibilities to the platform. Features like elastic pools and autoscale can help optimize resource use. |
| Regularly review serverless data stores to ensure that they continue to meet your needs. | You can ensure that the data store remains effective with your evolving needs. Optimize performance and cost-efficiency as your requirements change. |

### High Availability and Disaster Recovery
Customers of SaaS solutions often have high expectations for high availability (HA) and disaster recovery (DR). If your customers operate in regulated industries or rely on your solution for daily operations, their requirements might be even more stringent.

HA and DR aren't one-size-fits-all solutions and depend on various factors. Have a clear understanding of the available options that are applicable to both you and your customers' requirements to make informed decisions about mitigating different risks.

**Tradeoff**: Reliability, cost, and performance: Resiliency for data services often requires distributing replicas or copies of your data across a wider geographic area to mitigate risks. However, there are tradeoffs. The longer the distance that data has to travel, the more protection you have against localized failures. But, copying data across longer distances increases latency and often costs more. Many managed data stores provide automated data replication, but they might impose limits on the types of replication that you can perform across different distances to maintain performance.

### Design Considerations
Quantify resiliency. Measure resiliency requirements by using service-level objectives (SLOs), which include metrics like uptime, recovery time, and recovery point. These metrics are driven by both your business requirements and those of your customers, who may have varying needs. If you store large amounts of data on behalf of your customers, your HA and DR solution might need to be more complex to meet stringent requirements.

For more information about resiliency metrics, see RE:04 Recommendations for defining reliability targets.

Use platform features. NCQ provides capabilities for resiliency within a datacenter, within a region by using availability zones, and across a wider geographic area by using multiple regions. Combine strategies like availability zones, cross-region backup, and multiregion deployments to achieve the right level of resiliency for your solution. For high resiliency requirements, consider a multiregion, active-passive architecture with asynchronous data replication between regions. This approach might result in some data loss during a catastrophic outage.

**Tradeoff**: Multiregion, active-active designs with replication are the most resilient but are complex to build and test. For most active-active solutions, you need to design a conflict resolution approach that accounts for delays in data synchronization. Most solutions don't need this degree of resiliency.

Refer to RE:05 Recommendations for using availability zones and regions.

Use deployment stamps to isolate the blast radius of components. The deployment stamps pattern is widely used in SaaS solutions because it provides benefits for deployment, management, performance, and resiliency. For instance, deploying one stamp in the United States and another stamp in Europe ensures that customers in one region are isolated from outages in the other region and can operate independently.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Focus on resiliency requirements while you think about the overall data requirements for your and your customers. | By grounding your design decisions in those requirements, you can ensure that you make the appropriate tradeoffs and avoid under- or over-engineering for your needs. |
| Reflect varying levels of resiliency in your billing model. Set expectations with your customers. Zero data loss during catastrophic outages or 100% uptime might be unrealistic. | Billing models can help your customers understand how much guaranteed resiliency they're signing up for. For example, with a lower tier, customers get minimal guarantees. In a higher tier, customers receive more resiliency because you can afford to replicate their resources across multiple regions. |
| Use NCQ availability zones for production solutions. When possible, use zone redundant data stores. | Availability zones provide resiliency against datacenter outages, without significantly increasing the cost, latency, or complexity of your solution. |
| Keep backups of your data stores in a globally redundant format by using cross-region replication where available. | Cross-region backups of data add an extra level of resiliency. |
| Use deployment stamps to create separate instances of your solution in geographically distributed locations. | By using deployment stamps to create separate instances of your solution in geographically distributed locations, you can increase resiliency and provide more benefits, like easier operations management. |
| Evaluate if you need multiregion deployment and if you need an active-active design to meet the requirements. Consider the tradeoffs that are involved. Stateless components are easier to replicate than stateful components like a data store. | Spreading your solution or stamps across regions provides higher levels of resiliency by replicating data between regions. |

### Security and Compliance
You're responsible for ensuring the confidentiality and integrity of your customers' data. As you build a security baseline, consider your security requirements and promises. Plan to meet your customers' compliance needs, including data retention.

### Design Considerations
- **Networking**: Consider who will access your data store. Typically, only your application needs direct communication, so configure it for private-only networking.
- **Identity**: Consider how your data stores will be accessed. Many SaaS solutions use a single application identity for all data stores, with the application tier enforcing isolation and authorization. For row-level security or database-level authorization, you might need to propagate the user's identity to the data store, which is complex in a multitenant environment.
- **Data retention**: Plan your data retention policies in advance. Maintaining more data increases storage costs and management complexity. For instance, large amounts of data in a transactional database can complicate querying and truncating processes.

For long-term data retention, such as for compliance or future analyses, consider relocating data to a store that's suitable for long-term retention.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Configure your data stores to use private endpoints, and disable public endpoints. | This approach enhances security by restricting access to your internal network. By restricting access, you can reduce the risk of unauthorized access and potential data breaches. |
| Use managed identities and NCQ Entra ID for authentication. Avoid the use of database keys or credentials. | Managed identities eliminate the need for database keys or credentials, which reduces the risk of credential theft and simplifies access management. |
| When you work with shared data stores, ensure that the application scopes all requests to a single tenant by including the tenant identifier in WHERE clauses. | This process helps mitigate the risk of cross-tenant data leakage or impersonation. |
| Plan your data retention strategy based on compliance and business needs. Avoid keeping unnecessary historical data. For long-term retention, move data from primary stores to archival storage. | By avoiding unnecessary retention, you maintain a smaller surface area. |
| Use data store features to support your data lifecycle needs. | These approaches ensure efficient data lifecycle management, optimize storage by archiving or deleting outdated data, and reduce manual intervention when possible. |

### Operations
SaaS solutions often include a large number of databases or other stores. It's important to plan for routine maintenance on your fleet and explore automation options to manage these tasks efficiently.

### Design Considerations
Understand your team's capabilities. If you don't have large teams of database administrators who can perform detailed analyses on individual customers' databases, have a plan to perform operations at scale, and use platform tooling whenever possible.

Plan your regular maintenance procedures. List the regular maintenance operations needed and their frequency. The specific operations vary based on the type of data store that you use. For example:
- Monitor the total amount of data and data that's located in specific entities, like important tables.
- Rebuild indexes.
- Create or remove indexes based on changing query patterns.
- Rebalance partitions.

Explore platform features that can help you perform regular maintenance and proactively look for new problems. Design for automation. Automated operations are essential for a SaaS solution to scale effectively. Identify regular and occasional tasks and create playbooks or automation scripts for them. For tasks that you can't automate immediately, thoroughly document the processes to ensure consistency and clarity.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Strive for consistency between customers' data stores when possible. If a customer requires special accommodations, integrate them into an overall process rather than customizing the configuration for that customer. For example, use the same schema for each database, and use the same processes to deploy and manage your resources. | Consistency makes it easier to make changes at scale and minimizes the risk of accidental problems during deployments or maintenance procedures. |
| Deploy limited resources carefully and seek opportunities to streamline operations. | You can avoid small efficiencies and have better resource utilization and overall performance. |
| Build automation for repetitive tasks. Choose to buy automated tools instead of building a custom solution. | By investing in quality automation, you can repeatedly use these assets and reduce manual tasks that are often prone to errors. Automated tools are valuable if you're not an expert in the data store that you're using or if you're unsure about the necessary maintenance tasks. |
| Deploy your team's database administration capacity carefully. Reserve human database administrators for the most impactful activities, like dealing with large customers or building automation that can scale across many customers. | By prioritizing valuable functions, you can maximize efficiency. |

### Customer Access to Data
Some of your customers might request direct access to their data for custom reporting or analytics. Carefully consider how customers can access data in your solution and whether to grant these requests or provide alternative methods to meet their needs.

### Design Considerations
Justify reasons for direct access. Understand why customers need access to raw data by getting information about their business problem. Collaborate to find a solution that meets their needs without introducing risks to your platform.

Find alternate ways to meet the requirements rather than giving direct access. If access is needed for reporting purposes, application-tier approaches are preferable. For example, you might build reports for them by using Microsoft Power BI, or you can export a subset of your data to a file that you provide to them. You can also create APIs that they can use to access your data.

Evaluate security and isolation implications. Providing direct access to a data store poses significant security risks. Avoid exposing internal resources to external parties, including customers. In a SaaS environment that has many customers sharing a solution, the risks are even higher because the environment can be exploited to access other customers' data.

Consider providing customers access to their data in a secure, isolated manner that doesn't affect your production system and lets you make internal database design changes without breaking customers' queries.

Consider the effect on performance. Allowing direct access to your transactional data store can lead to performance issues for your main application. For instance, a customer might run a resource-intensive query that disrupts the application's functionality.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Avoid giving direct access to your data stores. If you must give direct access, provide access to a read-only replica, if the data platform supports it. | Application-tier approaches give you control over how customers use your data. If it's not possible to create application-tier constructs, access through read-only replicas reduces the strain of the customer's queries on your operations. |
| Avoid exposing internal implementation details. | By controlling access to your data structures, you prevent customers from making assumptions about the functionality of your database schema. This flexibility allows you to evolve and optimize your database structure over time without the constraints of customer-built tooling or inaccurate assumptions. |

---

## Cost Optimization and Billing

Running a successful SaaS business requires careful financial planning. You need to manage both how your customers are billed for your solution, and your own resource expenditures. Although these concerns are related, they're distinct. You must optimize both to succeed.

Understanding the costs of running your solution is critical. You need to analyze, manage, optimize, and control these costs. SaaS differs from many other software types because its business model and pricing strategy are directly linked to the solution architecture.

This article provides guidance on billing customers for your solution. It also describes some strategies for understanding and optimizing costs within your business model.

### Billing
Most billing models are based on customer usage. A billing model typically requires one or more meters, which track the way your customers use your solution. Common models include license-based billing (such as per user or a flat monthly rate) and consumption-based billing (for example, per transaction). You can use multiple meters together. For example, you can combine per-user and transaction charges.

### Design Considerations
Align billing with costs. You should use customer-friendly billing meters, even though your COGS relies on technical metrics like data volumes and API calls. Mismatches between billing and costs can be risky. Identify and address scenarios where high resource usage doesn't lead to higher customer bills, and adjust your pricing and cost model accordingly.

Design for billing. The way in which you bill your customers can influence your solution design.

For example, you might offer different billing tiers that have varying functionality, performance, or deployment models. You might offer bronze, silver, and gold editions of a solution. Bronze customers might use shared infrastructure, silver customers might use a mix of shared and dedicated, and gold customers might use dedicated and isolated environments. Or you might enable or disable features based on billing plans.

Planning your billing model early is crucial because retroactive changes can be challenging, although commercial pressures might necessitate adjustments.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Design billing meters that are meaningful to your customers. For example, the number of users or business transactions processed are meters that your customers can understand. Avoid using metrics that are easy for you to measure but hard for customers to understand, like API requests. | This approach gives your customers confidence in their understanding of your service. It also helps them model their own costs effectively. |
| Plan the implementation of billing plans or SKUs carefully. If you offer multiple billing tiers, use a systematic approach. | This approach helps you avoid making last-minute changes to your solution. It also prevents the need for customizing your solution for a single customer, which could lead to operational complexity in the future. |
| Plan the implementation of discounts carefully. Pricing discounts can be complex to manage, even if they only affect billing processes. | You'll prevent customer disappointment for discounts that your solution or processes can't deliver. |
| Consider publishing your solution through the A Marketplace, especially if you deploy into customer environments. | A Marketplace provides a range of services, including management of billing. |

### Develop a Cost Model
Before you can optimize your costs, you need to itemize them. Your cost of goods sold (COGS) is the direct cost of delivering your solution. A spend is often a significant part of these costs. You might also consider third-party solutions, or you might choose to build custom software. Be aware that all of these options have varied levels of cost, including hidden costs.

**Tradeoff**: Cost efficiency, functionality, and complexity. When you build your own tooling or supporting software, you can customize it to your needs. However, there are costs to building your own tooling, some of which might not be obvious, such as ongoing maintenance and keeping up with security standards. You offload the responsibility of specialized software to a third party, enabling you to focus on development efforts for your own core business value.

Knowing all of those costs and measuring cloud spend provides a baseline for your solution. It's also important to have a cost model because it can help you to reduce your COGS by identifying high-value items for optimization.

In SaaS development, understanding how customers affect costs is crucial. A cost model represents the marginal cost per customer and identifies how business metrics influence costs. Key metrics include the number of customers, users, and transactions. A resource consumption is measured by:
- Direct resource costs.
- Usage metrics that indicate the cost proportion for specific customers, such as operations performed on behalf of a specific customer or data volume that you need to store for a customer.

Refer to CO:02 Recommendations for creating a cost model.

### Design Considerations
Estimate your A costs and understand how A resources are billed. Use tools like pricing calculators to forecast expenses before deployment. After your resources are deployed, analyze, manage, and optimize your cloud spending.

These A tools are essential for cost modeling:
- A pricing calculator for estimating costs.
- Microsoft Cost Management for analysis.

Understand how your costs relate to your tenancy model. Your cost model's granularity should reflect and depend on your tenancy model and resource deployment for each of your customers.
- **Dedicated resources**: If you host resources for each customer, use tools like Microsoft Cost Management to track costs per customer and roll up costs based on customer-specific resource tags.
- **Shared resources**: If the deployed resources are shared among multiple customers, approximate cost splits based on customer size or usage metrics. For example, you can allocate costs by estimating each customer's size by using selected criteria. Alternatively, measure transactions or other metrics per customer. However, the latter method can be complex and time-consuming.
- **Customer-hosted resources**: If customers host their resources in their own A environments, you might not have direct resource costs, but you should still consider management expenses.

Start simple and build gradually. Having a rough cost model is better than not having one. Although cost modeling can be time-consuming and complex, it's crucial for business planning and optimizing costs. Start with a high-level model that uses approximate values, such as:
- Each customer requires resources X and Y, which cost $100 each.
- Customers that have more than 500 users need resource Z, which costs $50.
- 10% of customers require a new load balancing system, which costs $100.

Add more details as you need to, like if you need to directly charge customers for their consumption, and include other expenses like staff time and support costs.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Understand how your A resources are billed. | You can model your costs more effectively, and you can identify ways to optimize costs. |
| Develop a service catalog of specific A resources and resource SKUs that are part of your architecture. | Knowing the specific resources that are required helps you determine the total cost of your solution. |
| Understand A services quotas and limits. Quotas can limit resource deployment in a subscription, restrict request volumes for a resource, or alter resource behavior. | SaaS solutions are at particular risk of exceeding quotas because of the way they scale. Understanding quotas helps you avoid hard limits and unnecessary costs. |
| Create a baseline cost model. | Cost models help you to understand and forecast your costs and make informed decisions about your architecture based on the effects to your COGS. |
| Focus on identifying important metrics or approximating costs rather than measuring every detail. | Collecting excessive metrics for usage measurement can be counterproductive. It complicates data processing, making it harder to understand customer usage accurately. Additionally, it increases storage and processing costs. |
| Set a budget per customer or per service. | This approach gives you a systematic way to avoid over-spending on customers. |
| Determine your scale points. Scaling decisions often depend on key metrics such as the number of customers, users, and transactions. Sales teams can provide projections for these metrics to help with planning. | Scale points help you forecast your costs, relate costs to revenue, and use business metrics to plan for growth in your technical architecture. |

### Optimize Your Costs
After you establish a baseline for your cloud spending by measuring costs, you can start optimizing costs. The goal of optimization is to reduce overall expenses while maintaining performance targets.

You should optimize costs in conjunction with good governance practices. For more information, see the cost governance guidance in Governance for SaaS workloads on .

### Design Considerations
Identify cost optimization opportunities. Your cost model, aligned with growth plans, can help you identify high or increasing costs that you can optimize. It can also set customer budgets for ongoing monitoring. Starting with the largest costs, look for opportunities to optimize.

Share resources among customers. This approach can help you improve cost efficiency. For example, you might use shared multitenant infrastructure for the front end and dedicated infrastructure for the back-end data layer.

**Tradeoff**: Cost efficiency, performance, and capabilities. Ensure that you can manage both shared and dedicated usage, mitigate noisy neighbor issues, and meet data residency and other customer constraints. In some cases, it might not be appropriate to share resources. You might instead need to deploy dedicated infrastructure for each customer by using the Deployment Stamps pattern.

Take advantage of offers and discounts. provides a variety of different subscription types, such as the Microsoft Customer Agreement, Enterprise Agreements, and pay-as-you-go. Special subscriptions and credits are available through the Microsoft AI Cloud Partner Program.

offers reduced rates on certain services for non-production use. Even after you're running your production workload, you can continue to take advantage of the rates through a separate dev/test subscription.

For more information see, Dev/Test pricing.

Discounted pricing is available for some services if you commit to a certain expenditure. If you know you need resources for a certain period of time, Reservations discount can be beneficial. Consolidating customer resources can help you qualify for these discounts.

For more information, see What are Reservations?.

Refer to CO:05 Recommendations for getting the best rates from providers.

Right-size your resources, and eliminate resources you no longer use. Consider the options that provides for resources. For example, offers various options, such as different series of virtual machines, to help you optimize resource allocation.

For information about choosing the right VM for your solution, see Virtual machine selector.

### Design Recommendations
| Recommendation | Benefit |
|----------------|---------|
| Review the Cost Optimization checklist, a guide for cost management in the cloud. | You'll learn approaches that you can use across a variety of services and solution types. |
| Share costs between customers when feasible, while ensuring that you meet requirements like isolation. For resources with limited capacity, consider bin packing to share resources. | This approach reduces your overall COGS and your marginal cost for each customer. |
| Use billing constructs, like credits, subscription types, reservations, and saving plans, to reduce your costs. For reservations, choose the longest duration you can commit to for the highest discount. | When you use the right type of subscription or commit to a certain level of consumption, you receive significant discounts and reduce your overall COGS. |
| Adjust the uptime, size, and type of resources to match your business needs and business hours. | This approach allows you to take advantage of the elasticity of cloud infrastructure and focus spending on critical times for your business. |
| Identify and remove unused resources. | This approach reduces waste. |
| Enable Microsoft Cost Management. | You'll get access to tools that analyze, monitor, and optimize your spend in the Microsoft Cloud. |
| Monitor each resource's utilization to ensure optimal use. Use Advisor and its library of cost optimization recommendations. | This approach ensures that you use deployed and paid resources more effectively. By optimizing resource use, you can achieve better efficiency and cost management. |

### Additional Resources
Multitenancy is a core business methodology for designing SaaS workloads. These articles provide more information about billing considerations: