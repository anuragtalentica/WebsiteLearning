using ExamPrep.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.Infrastructure.Data;

public static class SeedData
{
    public static async Task SeedAsync(ExamPrepDbContext context)
    {
        if (await context.Certifications.AnyAsync())
            return;

        var certifications = new List<Certification>
        {
            CreateAZ900(),
            CreateAWS_CCP(),
            CreateCompTIA_SecurityPlus(),
            CreateAWS_SAA(),
            CreateCompTIA_APlus(),
            CreateGoogle_ACE(),
            CreateAZ104()
        };

        context.Certifications.AddRange(certifications);
        await context.SaveChangesAsync();

        // Seed Modules & Lessons for AZ-900
        await SeedModulesAndLessons(context, certifications);

        // Seed Mock Tests
        await SeedMockTests(context, certifications);

        // Seed Certification Paths
        await SeedCertPaths(context, certifications);

        // Seed News
        await SeedNews(context);
    }

    // ─────────────────────────────────────────────
    // Microsoft AZ-900 — Azure Fundamentals
    // ─────────────────────────────────────────────
    private static Certification CreateAZ900() => new()
    {
        Vendor = "Microsoft",
        Name = "Azure Fundamentals",
        Code = "AZ-900",
        Description = "Demonstrate foundational knowledge of cloud concepts, core Azure services, plus Azure management and governance features and tools.",
        Category = "Cloud",
        Difficulty = "Beginner",
        IsActive = true,
        CreatedAt = DateTime.UtcNow,
        Topics = new List<Topic>
        {
            new()
            {
                Name = "Cloud Concepts",
                OrderIndex = 1,
                Questions = new List<Question>
                {
                    Q("Which cloud computing model allows users to pay only for the resources they use?",
                      "The pay-as-you-go model is a key benefit of cloud computing where you only pay for what you consume, reducing upfront capital expenditure.", 1,
                      ("Pay-as-you-go", true), ("Fixed subscription", false), ("One-time license", false), ("Perpetual license", false)),

                    Q("What is the benefit of cloud agility?",
                      "Agility in cloud computing means the ability to rapidly develop, test, and deploy applications, reducing time to market.", 1,
                      ("The ability to rapidly develop, test, and deploy applications", true), ("Guaranteed 100% uptime", false), ("Unlimited free storage", false), ("Automatic code writing", false)),

                    Q("Which type of cloud service provides the most control over the underlying infrastructure?",
                      "IaaS provides the most control, giving you access to virtual machines, networking, and storage while the cloud provider manages the physical hardware.", 2,
                      ("Infrastructure as a Service (IaaS)", true), ("Platform as a Service (PaaS)", false), ("Software as a Service (SaaS)", false), ("Function as a Service (FaaS)", false)),

                    Q("What does high availability in cloud computing ensure?",
                      "High availability ensures that applications and services remain accessible and operational with minimal downtime, typically through redundancy and failover mechanisms.", 1,
                      ("Systems remain operational with minimal downtime", true), ("Data is encrypted at all times", false), ("Applications run faster", false), ("Storage costs are reduced", false)),

                    Q("Which cloud deployment model uses both on-premises and cloud resources?",
                      "A hybrid cloud combines on-premises infrastructure with public cloud services, allowing data and applications to be shared between them.", 1,
                      ("Hybrid cloud", true), ("Public cloud", false), ("Private cloud", false), ("Community cloud", false)),

                    Q("What is the concept of 'elasticity' in cloud computing?",
                      "Elasticity is the ability to automatically scale resources up or down based on demand, ensuring optimal resource utilization and cost efficiency.", 2,
                      ("Automatically scaling resources based on demand", true), ("Making resources indestructible", false), ("Sharing resources between tenants", false), ("Encrypting data in transit", false)),

                    Q("Which of the following is a characteristic of a public cloud?",
                      "In a public cloud, resources are owned and operated by a third-party provider and shared across multiple organizations (tenants) over the internet.", 1,
                      ("Resources are shared among multiple organizations", true), ("Infrastructure is owned by a single organization", false), ("No internet connection is needed", false), ("Data is stored on-premises only", false)),
                }
            },
            new()
            {
                Name = "Azure Architecture and Services",
                OrderIndex = 2,
                Questions = new List<Question>
                {
                    Q("What is an Azure Region?",
                      "An Azure Region is a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network.", 1,
                      ("A set of datacenters deployed within a latency-defined perimeter", true), ("A single datacenter", false), ("A virtual network", false), ("A type of Azure subscription", false)),

                    Q("Which Azure service is used to deploy and manage virtual machines?",
                      "Azure Virtual Machines is an IaaS offering that lets you create and use virtual machines in the cloud.", 1,
                      ("Azure Virtual Machines", true), ("Azure App Service", false), ("Azure Functions", false), ("Azure Logic Apps", false)),

                    Q("What is Azure Blob Storage primarily used for?",
                      "Azure Blob Storage is optimized for storing massive amounts of unstructured data such as text, images, videos, and binary data.", 2,
                      ("Storing unstructured data like images, videos, and documents", true), ("Hosting relational databases", false), ("Running serverless functions", false), ("Managing DNS records", false)),

                    Q("Which Azure service provides serverless compute?",
                      "Azure Functions is a serverless compute service that lets you run event-triggered code without having to provision or manage infrastructure.", 2,
                      ("Azure Functions", true), ("Azure Virtual Machines", false), ("Azure Kubernetes Service", false), ("Azure SQL Database", false)),

                    Q("What is the purpose of Azure Resource Groups?",
                      "Resource Groups are logical containers that hold related Azure resources for billing, access control, and lifecycle management.", 1,
                      ("To logically organize and manage related Azure resources", true), ("To provide network isolation", false), ("To encrypt data at rest", false), ("To monitor application performance", false)),
                }
            },
            new()
            {
                Name = "Azure Management and Governance",
                OrderIndex = 3,
                Questions = new List<Question>
                {
                    Q("What is Azure Policy used for?",
                      "Azure Policy helps enforce organizational standards and assess compliance at scale by creating, assigning, and managing policies.", 2,
                      ("Enforcing organizational standards and compliance", true), ("Managing user passwords", false), ("Deploying virtual machines", false), ("Monitoring network traffic", false)),

                    Q("What does Azure Cost Management help you do?",
                      "Azure Cost Management provides tools to monitor, allocate, and optimize cloud spending across your Azure resources.", 1,
                      ("Monitor, allocate, and optimize cloud spending", true), ("Deploy resources faster", false), ("Encrypt data at rest", false), ("Scale applications automatically", false)),

                    Q("What is the purpose of Azure Role-Based Access Control (RBAC)?",
                      "Azure RBAC provides fine-grained access management for Azure resources, allowing you to grant only the amount of access that users need to perform their jobs.", 2,
                      ("Managing who has access to Azure resources and what they can do", true), ("Encrypting all data in Azure", false), ("Automatically scaling resources", false), ("Monitoring resource health", false)),

                    Q("Which tool provides a unified management console for Azure?",
                      "The Azure Portal is a web-based, unified console that provides an alternative to command-line tools for managing Azure resources.", 1,
                      ("Azure Portal", true), ("Azure PowerShell", false), ("Azure Marketplace", false), ("Azure Advisor", false)),

                    Q("What is an ARM template?",
                      "Azure Resource Manager (ARM) templates are JSON files that define the infrastructure and configuration for your Azure deployment, enabling Infrastructure as Code.", 3,
                      ("A JSON file that defines Azure infrastructure as code", true), ("A billing report for Azure resources", false), ("A network security configuration", false), ("A virtual machine image", false)),
                }
            }
        }
    };

    // ─────────────────────────────────────────────
    // AWS CCP — Cloud Practitioner
    // ─────────────────────────────────────────────
    private static Certification CreateAWS_CCP() => new()
    {
        Vendor = "Amazon Web Services",
        Name = "Cloud Practitioner",
        Code = "CLF-C02",
        Description = "Validate your overall understanding of the AWS Cloud with the foundational Cloud Practitioner certification.",
        Category = "Cloud",
        Difficulty = "Beginner",
        IsActive = true,
        CreatedAt = DateTime.UtcNow,
        Topics = new List<Topic>
        {
            new()
            {
                Name = "Cloud Concepts",
                OrderIndex = 1,
                Questions = new List<Question>
                {
                    Q("What is one of the main benefits of the AWS Cloud?",
                      "AWS allows you to trade fixed capital expenses for variable operational expenses, meaning you only pay for what you consume.", 1,
                      ("Trade capital expense for variable expense", true), ("Guaranteed lowest price", false), ("No need for security", false), ("Unlimited free storage", false)),

                    Q("What does the AWS Well-Architected Framework help with?",
                      "The Well-Architected Framework helps cloud architects build secure, high-performing, resilient, and efficient infrastructure based on five pillars.", 2,
                      ("Building secure, reliable, and efficient cloud infrastructure", true), ("Reducing AWS pricing", false), ("Automating code deployments only", false), ("Managing employee access only", false)),

                    Q("What is the AWS Shared Responsibility Model?",
                      "In the Shared Responsibility Model, AWS is responsible for security OF the cloud (infrastructure), while customers are responsible for security IN the cloud (data, applications).", 2,
                      ("AWS manages cloud infrastructure security; customers manage their data security", true), ("AWS handles all security concerns", false), ("Customers manage physical datacenter security", false), ("Security is optional in AWS", false)),

                    Q("Which of the following is an advantage of cloud computing?",
                      "Cloud computing allows you to go global in minutes by deploying resources in multiple geographic regions with just a few clicks.", 1,
                      ("Go global in minutes", true), ("Requires large upfront investment", false), ("Limited to one geographic region", false), ("Requires physical hardware management", false)),

                    Q("What is the pricing model where you pay for compute capacity by the hour or second?",
                      "On-Demand pricing lets you pay for compute capacity per hour or per second with no long-term commitments.", 1,
                      ("On-Demand Instances", true), ("Reserved Instances", false), ("Spot Instances", false), ("Dedicated Hosts", false)),

                    Q("What does 'elasticity' mean in AWS?",
                      "Elasticity in AWS means the ability to acquire resources when needed and release them when no longer needed, automatically scaling to match demand.", 1,
                      ("Automatically scaling resources to match demand", true), ("Making resources unbreakable", false), ("Keeping resources running permanently", false), ("Sharing resources between accounts", false)),
                }
            },
            new()
            {
                Name = "AWS Core Services",
                OrderIndex = 2,
                Questions = new List<Question>
                {
                    Q("Which AWS service is used to run virtual servers in the cloud?",
                      "Amazon EC2 (Elastic Compute Cloud) provides resizable compute capacity in the cloud, essentially virtual servers.", 1,
                      ("Amazon EC2", true), ("Amazon S3", false), ("Amazon RDS", false), ("AWS Lambda", false)),

                    Q("Which AWS service provides scalable object storage?",
                      "Amazon S3 (Simple Storage Service) provides object storage with high availability, security, and virtually unlimited scalability.", 1,
                      ("Amazon S3", true), ("Amazon EBS", false), ("Amazon EC2", false), ("Amazon DynamoDB", false)),

                    Q("What is Amazon RDS?",
                      "Amazon RDS (Relational Database Service) makes it easy to set up, operate, and scale relational databases in the cloud.", 1,
                      ("A managed relational database service", true), ("A serverless compute service", false), ("A content delivery network", false), ("A file storage service", false)),

                    Q("Which AWS service provides serverless computing?",
                      "AWS Lambda lets you run code without provisioning or managing servers. You pay only for the compute time consumed.", 2,
                      ("AWS Lambda", true), ("Amazon EC2", false), ("Amazon ECS", false), ("Amazon Lightsail", false)),

                    Q("What is Amazon VPC?",
                      "Amazon Virtual Private Cloud (VPC) lets you provision a logically isolated section of the AWS Cloud where you can launch resources in a virtual network you define.", 2,
                      ("A service to create isolated virtual networks in AWS", true), ("A virtual machine service", false), ("A database backup service", false), ("A code deployment service", false)),

                    Q("Which AWS service is used for Domain Name System (DNS) management?",
                      "Amazon Route 53 is a scalable and highly available DNS web service that routes end users to applications.", 2,
                      ("Amazon Route 53", true), ("Amazon CloudFront", false), ("AWS Direct Connect", false), ("Amazon VPC", false)),

                    Q("What does Amazon CloudFront do?",
                      "Amazon CloudFront is a content delivery network (CDN) service that delivers data, videos, applications, and APIs with low latency and high transfer speeds.", 2,
                      ("Delivers content with low latency via a global CDN", true), ("Stores objects in the cloud", false), ("Manages DNS records", false), ("Provisions virtual servers", false)),
                }
            },
            new()
            {
                Name = "Security and Compliance",
                OrderIndex = 3,
                Questions = new List<Question>
                {
                    Q("Which AWS service manages user access and encryption keys?",
                      "AWS IAM (Identity and Access Management) enables you to manage access to AWS services and resources securely.", 1,
                      ("AWS IAM", true), ("Amazon GuardDuty", false), ("AWS Shield", false), ("Amazon Inspector", false)),

                    Q("What is AWS MFA?",
                      "Multi-Factor Authentication (MFA) adds an extra layer of protection by requiring a second form of authentication beyond just a password.", 1,
                      ("An extra layer of security requiring a second authentication factor", true), ("A managed file system", false), ("A monitoring dashboard", false), ("A billing management tool", false)),

                    Q("Which service protects against DDoS attacks?",
                      "AWS Shield provides managed DDoS protection that safeguards applications running on AWS.", 2,
                      ("AWS Shield", true), ("AWS WAF", false), ("Amazon Inspector", false), ("AWS IAM", false)),

                    Q("What is the principle of least privilege?",
                      "The principle of least privilege means granting only the minimum permissions necessary for a user or service to perform their required tasks.", 2,
                      ("Grant only the minimum permissions needed for a task", true), ("Give everyone admin access for simplicity", false), ("Deny all access by default permanently", false), ("Share credentials among team members", false)),

                    Q("Which service provides threat detection for your AWS accounts?",
                      "Amazon GuardDuty is a threat detection service that continuously monitors for malicious activity and unauthorized behavior.", 3,
                      ("Amazon GuardDuty", true), ("AWS Config", false), ("Amazon Macie", false), ("AWS CloudTrail", false)),
                }
            },
            new()
            {
                Name = "Billing and Pricing",
                OrderIndex = 4,
                Questions = new List<Question>
                {
                    Q("Which tool helps estimate the cost of AWS services before deployment?",
                      "The AWS Pricing Calculator helps you estimate the monthly cost of AWS services based on your expected usage.", 1,
                      ("AWS Pricing Calculator", true), ("AWS Cost Explorer", false), ("AWS Budgets", false), ("AWS Trusted Advisor", false)),

                    Q("What is the AWS Free Tier?",
                      "The AWS Free Tier allows new customers to explore and try AWS services with certain usage limits for free, including 12-month, always-free, and trial offers.", 1,
                      ("A set of free usage limits for exploring AWS services", true), ("A discount for enterprise customers", false), ("A premium support tier", false), ("An educational certification program", false)),

                    Q("Which AWS support plan provides a Technical Account Manager (TAM)?",
                      "The Enterprise Support plan includes a designated Technical Account Manager who provides proactive guidance and advocacy.", 2,
                      ("Enterprise", true), ("Business", false), ("Developer", false), ("Basic", false)),

                    Q("What does AWS Cost Explorer provide?",
                      "AWS Cost Explorer provides an interface to visualize, understand, and manage your AWS costs and usage over time.", 1,
                      ("Visualization and analysis of your AWS spending", true), ("Automatic resource optimization", false), ("Free tier management", false), ("Security compliance reports", false)),
                }
            }
        }
    };

    // ─────────────────────────────────────────────
    // CompTIA Security+
    // ─────────────────────────────────────────────
    private static Certification CreateCompTIA_SecurityPlus() => new()
    {
        Vendor = "CompTIA",
        Name = "Security+",
        Code = "SY0-701",
        Description = "Validate your baseline cybersecurity skills needed to perform core security functions and pursue an IT security career.",
        Category = "General IT",
        Difficulty = "Intermediate",
        IsActive = true,
        CreatedAt = DateTime.UtcNow,
        Topics = new List<Topic>
        {
            new()
            {
                Name = "Threats, Vulnerabilities, and Mitigations",
                OrderIndex = 1,
                Questions = new List<Question>
                {
                    Q("What type of attack involves sending fraudulent emails pretending to be from a reputable source?",
                      "Phishing is a social engineering attack where attackers send deceptive emails to trick recipients into revealing sensitive information or clicking malicious links.", 1,
                      ("Phishing", true), ("Brute force", false), ("SQL injection", false), ("Man-in-the-middle", false)),

                    Q("What is a zero-day vulnerability?",
                      "A zero-day vulnerability is a security flaw that is unknown to the software vendor and has no available patch at the time of discovery.", 2,
                      ("A vulnerability unknown to the vendor with no available patch", true), ("A vulnerability that was fixed on day zero", false), ("A vulnerability that only exists for one day", false), ("A vulnerability in day-zero backup systems", false)),

                    Q("What type of malware encrypts files and demands payment for decryption?",
                      "Ransomware encrypts the victim's files, making them inaccessible, and demands a ransom payment in exchange for the decryption key.", 1,
                      ("Ransomware", true), ("Spyware", false), ("Adware", false), ("Trojan", false)),

                    Q("What is a SQL injection attack?",
                      "SQL injection is an attack where malicious SQL code is inserted into input fields to manipulate or access the database behind a web application.", 2,
                      ("Inserting malicious SQL code into application input fields", true), ("Flooding a server with traffic", false), ("Intercepting network packets", false), ("Cracking password hashes", false)),

                    Q("What is social engineering?",
                      "Social engineering is the psychological manipulation of people into performing actions or divulging confidential information, exploiting human trust rather than technical vulnerabilities.", 1,
                      ("Manipulating people to reveal confidential information", true), ("Writing malicious code", false), ("Exploiting software bugs", false), ("Scanning network ports", false)),

                    Q("What is a man-in-the-middle (MITM) attack?",
                      "In a MITM attack, the attacker secretly intercepts and potentially alters communications between two parties who believe they are communicating directly with each other.", 2,
                      ("Intercepting communications between two parties", true), ("Guessing passwords repeatedly", false), ("Sending mass spam emails", false), ("Physically accessing a server room", false)),

                    Q("What is the difference between a vulnerability and a threat?",
                      "A vulnerability is a weakness in a system, while a threat is any potential danger that could exploit that vulnerability to cause harm.", 2,
                      ("A vulnerability is a weakness; a threat exploits that weakness", true), ("They are the same thing", false), ("A threat is always internal; a vulnerability is external", false), ("A vulnerability is intentional; a threat is accidental", false)),
                }
            },
            new()
            {
                Name = "Security Architecture",
                OrderIndex = 2,
                Questions = new List<Question>
                {
                    Q("What is the purpose of a firewall?",
                      "A firewall monitors and controls incoming and outgoing network traffic based on predetermined security rules, acting as a barrier between trusted and untrusted networks.", 1,
                      ("Monitor and control network traffic based on security rules", true), ("Encrypt all stored data", false), ("Scan for viruses in email", false), ("Manage user passwords", false)),

                    Q("What does encryption do to data?",
                      "Encryption converts plaintext data into an unreadable format (ciphertext) using an algorithm and key, ensuring only authorized parties can read it.", 1,
                      ("Converts data into an unreadable format for unauthorized users", true), ("Compresses data to save storage", false), ("Deletes sensitive data permanently", false), ("Moves data to a secure location", false)),

                    Q("What is the principle of defense in depth?",
                      "Defense in depth is a security strategy that employs multiple layers of security controls throughout an IT system, so if one layer fails, others still provide protection.", 2,
                      ("Using multiple layers of security controls", true), ("Using the strongest single security control", false), ("Focusing all security on the network perimeter", false), ("Relying on user training alone", false)),

                    Q("What is a VPN?",
                      "A Virtual Private Network creates an encrypted tunnel over a public network (like the internet), allowing users to securely access private network resources remotely.", 1,
                      ("An encrypted tunnel for secure remote access over public networks", true), ("A type of antivirus software", false), ("A physical network cable", false), ("A database backup tool", false)),

                    Q("What is multi-factor authentication (MFA)?",
                      "MFA requires users to provide two or more verification factors (something you know, have, or are) to gain access, significantly reducing unauthorized access risk.", 1,
                      ("Requiring two or more verification factors for access", true), ("Using multiple passwords", false), ("Logging in from multiple devices", false), ("Having multiple user accounts", false)),

                    Q("What is the purpose of network segmentation?",
                      "Network segmentation divides a network into smaller segments or subnets, limiting the spread of attacks and improving security by controlling traffic between segments.", 2,
                      ("Dividing a network into smaller segments to limit attack spread", true), ("Making the network faster", false), ("Reducing the number of required IP addresses", false), ("Eliminating the need for firewalls", false)),
                }
            },
            new()
            {
                Name = "Security Operations",
                OrderIndex = 3,
                Questions = new List<Question>
                {
                    Q("What is an IDS?",
                      "An Intrusion Detection System monitors network traffic for suspicious activity and alerts administrators when potential threats are detected.", 2,
                      ("A system that monitors and alerts on suspicious network activity", true), ("A tool that blocks all incoming traffic", false), ("A password management system", false), ("A data backup solution", false)),

                    Q("What is the difference between IDS and IPS?",
                      "An IDS detects and alerts on threats but doesn't block them, while an IPS both detects and actively prevents/blocks suspicious activity.", 2,
                      ("IDS detects and alerts; IPS detects and blocks threats", true), ("IDS is hardware; IPS is software", false), ("IDS is for internal networks; IPS is for external", false), ("There is no difference", false)),

                    Q("What is a SIEM system?",
                      "Security Information and Event Management (SIEM) aggregates and analyzes log data from multiple sources to detect security threats and support compliance.", 3,
                      ("A system that aggregates logs to detect security threats", true), ("A type of firewall", false), ("An encryption algorithm", false), ("A backup management tool", false)),

                    Q("What is the purpose of penetration testing?",
                      "Penetration testing simulates real-world attacks on a system to identify vulnerabilities before malicious attackers can exploit them.", 2,
                      ("Simulating attacks to identify vulnerabilities", true), ("Testing network speed and performance", false), ("Training users on security policies", false), ("Installing security patches", false)),

                    Q("What is incident response?",
                      "Incident response is the organized approach to addressing and managing the aftermath of a security breach or attack, aiming to limit damage and reduce recovery time and costs.", 2,
                      ("An organized approach to managing security breaches", true), ("Preventing all security incidents", false), ("A daily security routine", false), ("Installing antivirus software", false)),
                }
            }
        }
    };

    // ─────────────────────────────────────────────
    // AWS SAA — Solutions Architect Associate
    // ─────────────────────────────────────────────
    private static Certification CreateAWS_SAA() => new()
    {
        Vendor = "Amazon Web Services",
        Name = "Solutions Architect Associate",
        Code = "SAA-C03",
        Description = "Validate your ability to design and implement distributed systems on AWS with this associate-level certification.",
        Category = "Cloud",
        Difficulty = "Intermediate",
        IsActive = true,
        CreatedAt = DateTime.UtcNow,
        Topics = new List<Topic>
        {
            new()
            {
                Name = "Resilient Architectures",
                OrderIndex = 1,
                Questions = new List<Question>
                {
                    Q("Which AWS service provides a fully managed message queuing service?",
                      "Amazon SQS (Simple Queue Service) is a fully managed message queuing service that decouples and scales microservices, distributed systems, and serverless applications.", 2,
                      ("Amazon SQS", true), ("Amazon SNS", false), ("Amazon Kinesis", false), ("AWS Step Functions", false)),

                    Q("What is the purpose of an Application Load Balancer (ALB)?",
                      "An ALB operates at Layer 7 (HTTP/HTTPS) and distributes incoming application traffic across multiple targets based on content of the request.", 2,
                      ("Distribute HTTP/HTTPS traffic across multiple targets based on content", true), ("Balance traffic at the TCP level only", false), ("Provide DNS resolution", false), ("Cache static content", false)),

                    Q("What is Amazon S3 replication used for?",
                      "S3 replication enables automatic, asynchronous copying of objects across S3 buckets for compliance, lower latency, or disaster recovery.", 2,
                      ("Automatically copying objects across buckets for DR or compliance", true), ("Compressing objects to save storage", false), ("Encrypting objects at rest", false), ("Converting object formats", false)),

                    Q("Which database service provides multi-AZ deployment for high availability?",
                      "Amazon RDS Multi-AZ deployments provide enhanced availability by automatically maintaining a synchronous standby replica in a different Availability Zone.", 2,
                      ("Amazon RDS with Multi-AZ", true), ("Amazon DynamoDB only", false), ("Amazon ElastiCache", false), ("Amazon Redshift", false)),

                    Q("What is an Auto Scaling group?",
                      "An Auto Scaling group contains a collection of EC2 instances that can automatically scale in or out based on defined policies to maintain application availability.", 2,
                      ("A collection of EC2 instances that scale based on demand", true), ("A group of S3 buckets", false), ("A set of security rules", false), ("A database cluster", false)),
                }
            },
            new()
            {
                Name = "High-Performing Architectures",
                OrderIndex = 2,
                Questions = new List<Question>
                {
                    Q("Which storage class is most cost-effective for infrequently accessed data?",
                      "S3 Standard-IA (Infrequent Access) offers lower storage costs for data that is accessed less frequently but requires rapid access when needed.", 2,
                      ("S3 Standard-IA", true), ("S3 Standard", false), ("S3 Glacier Deep Archive", false), ("S3 One Zone-IA", false)),

                    Q("What is Amazon DynamoDB?",
                      "Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.", 2,
                      ("A fully managed NoSQL database with fast, predictable performance", true), ("A relational database service", false), ("A file storage service", false), ("A message queue service", false)),

                    Q("What is the purpose of Amazon ElastiCache?",
                      "Amazon ElastiCache provides in-memory caching to improve application performance by storing frequently accessed data in memory rather than slower disk-based databases.", 3,
                      ("In-memory caching to improve application performance", true), ("Long-term data archival", false), ("Network load balancing", false), ("Serverless function execution", false)),

                    Q("When should you use Amazon EFS vs EBS?",
                      "Use EFS when you need a shared file system accessible by multiple EC2 instances simultaneously. Use EBS for single-instance block storage with high IOPS.", 3,
                      ("EFS for shared multi-instance access; EBS for single-instance block storage", true), ("EFS for block storage; EBS for file storage", false), ("They are interchangeable", false), ("EFS is always faster than EBS", false)),

                    Q("What does Amazon CloudFront use to reduce latency?",
                      "CloudFront uses a global network of edge locations to cache content closer to end users, reducing latency for content delivery.", 2,
                      ("Edge locations to cache content closer to users", true), ("Larger EC2 instances", false), ("Database replication", false), ("Bigger network bandwidth", false)),
                }
            },
            new()
            {
                Name = "Secure Architectures",
                OrderIndex = 3,
                Questions = new List<Question>
                {
                    Q("What is an IAM role used for?",
                      "An IAM role is an identity with permission policies that can be assumed by AWS services, applications, or users to gain temporary security credentials.", 2,
                      ("Providing temporary credentials with specific permissions to AWS services", true), ("Storing user passwords", false), ("Creating virtual networks", false), ("Monitoring application logs", false)),

                    Q("What is the purpose of a security group in AWS?",
                      "A security group acts as a virtual firewall for EC2 instances, controlling inbound and outbound traffic at the instance level.", 1,
                      ("A virtual firewall controlling traffic at the instance level", true), ("A group of IAM users", false), ("A billing management tool", false), ("A database access layer", false)),

                    Q("What is AWS KMS used for?",
                      "AWS Key Management Service (KMS) lets you create and manage cryptographic keys and control their use across AWS services and applications.", 2,
                      ("Creating and managing encryption keys", true), ("Managing Kubernetes clusters", false), ("Monitoring application performance", false), ("Deploying containers", false)),

                    Q("What is the difference between security groups and NACLs?",
                      "Security groups are stateful and operate at instance level, while Network ACLs are stateless and operate at subnet level. Security groups only allow rules; NACLs support allow and deny rules.", 3,
                      ("Security groups are stateful at instance level; NACLs are stateless at subnet level", true), ("They function identically", false), ("NACLs are stateful; security groups are stateless", false), ("Security groups work at VPC level; NACLs at instance level", false)),

                    Q("What is AWS CloudTrail?",
                      "AWS CloudTrail records API calls and account activity across your AWS infrastructure, providing governance, compliance, and audit capabilities.", 2,
                      ("A service that records API calls for auditing and compliance", true), ("A CDN service", false), ("A deployment pipeline tool", false), ("A database migration service", false)),
                }
            }
        }
    };

    // ─────────────────────────────────────────────
    // CompTIA A+ Core 1
    // ─────────────────────────────────────────────
    private static Certification CreateCompTIA_APlus() => new()
    {
        Vendor = "CompTIA",
        Name = "A+ Core 1",
        Code = "220-1101",
        Description = "Demonstrate competency in core IT skills including mobile devices, networking, hardware, virtualization, and troubleshooting.",
        Category = "General IT",
        Difficulty = "Beginner",
        IsActive = true,
        CreatedAt = DateTime.UtcNow,
        Topics = new List<Topic>
        {
            new()
            {
                Name = "Mobile Devices",
                OrderIndex = 1,
                Questions = new List<Question>
                {
                    Q("Which wireless standard operates on both 2.4 GHz and 5 GHz frequencies?",
                      "Wi-Fi 5 (802.11ac) primarily uses 5 GHz, but Wi-Fi 6 (802.11ax) operates on both 2.4 GHz and 5 GHz bands for better compatibility and performance.", 2,
                      ("802.11ax (Wi-Fi 6)", true), ("802.11b", false), ("802.11g", false), ("802.11a", false)),

                    Q("What is the purpose of a mobile device's GPS?",
                      "GPS (Global Positioning System) uses satellite signals to determine the precise geographic location of the device.", 1,
                      ("Determining the device's geographic location via satellites", true), ("Connecting to cellular networks", false), ("Providing internet access", false), ("Encrypting mobile data", false)),

                    Q("Which connector type is commonly used for modern Android devices?",
                      "USB Type-C is the modern standard connector for most Android devices, offering faster data transfer and reversible plug orientation.", 1,
                      ("USB Type-C", true), ("Lightning", false), ("Micro-USB", false), ("USB Type-A", false)),

                    Q("What does MDM stand for in mobile device management?",
                      "Mobile Device Management (MDM) is software that allows IT administrators to control, secure, and enforce policies on smartphones, tablets, and other endpoints.", 2,
                      ("Mobile Device Management", true), ("Multiple Data Modes", false), ("Managed Desktop Monitoring", false), ("Media Distribution Manager", false)),
                }
            },
            new()
            {
                Name = "Networking",
                OrderIndex = 2,
                Questions = new List<Question>
                {
                    Q("What is the purpose of DHCP?",
                      "Dynamic Host Configuration Protocol automatically assigns IP addresses and network configuration to devices on a network.", 1,
                      ("Automatically assigning IP addresses to devices", true), ("Encrypting network traffic", false), ("Resolving domain names to IPs", false), ("Routing traffic between networks", false)),

                    Q("What does DNS stand for and what does it do?",
                      "Domain Name System translates human-readable domain names (like google.com) into IP addresses that computers use to communicate.", 1,
                      ("Domain Name System — translates domain names to IP addresses", true), ("Dynamic Network Switch — routes packets", false), ("Data Network Security — encrypts traffic", false), ("Distributed Node Server — hosts websites", false)),

                    Q("What is the default subnet mask for a Class C network?",
                      "A Class C network uses the default subnet mask 255.255.255.0, providing 254 usable host addresses.", 2,
                      ("255.255.255.0", true), ("255.255.0.0", false), ("255.0.0.0", false), ("255.255.255.128", false)),

                    Q("What is the difference between TCP and UDP?",
                      "TCP is connection-oriented and ensures reliable delivery with error checking, while UDP is connectionless and faster but does not guarantee delivery.", 2,
                      ("TCP is reliable and connection-oriented; UDP is faster but unreliable", true), ("TCP is faster; UDP is more reliable", false), ("They are the same protocol", false), ("TCP is for wireless; UDP is for wired", false)),

                    Q("What port does HTTPS use by default?",
                      "HTTPS (HTTP Secure) uses port 443 by default for encrypted web communication.", 1,
                      ("443", true), ("80", false), ("22", false), ("8080", false)),
                }
            },
            new()
            {
                Name = "Hardware",
                OrderIndex = 3,
                Questions = new List<Question>
                {
                    Q("What is the purpose of RAM in a computer?",
                      "RAM (Random Access Memory) provides temporary, fast-access storage for data and programs currently in use by the CPU.", 1,
                      ("Providing temporary fast-access storage for active processes", true), ("Storing data permanently", false), ("Processing calculations", false), ("Connecting to the internet", false)),

                    Q("What type of storage uses flash memory with no moving parts?",
                      "Solid State Drives (SSDs) use flash memory chips to store data, offering faster speeds and better durability than traditional HDDs.", 1,
                      ("SSD (Solid State Drive)", true), ("HDD (Hard Disk Drive)", false), ("Optical Drive", false), ("Tape Drive", false)),

                    Q("What does the BIOS/UEFI do?",
                      "BIOS/UEFI is firmware that initializes hardware during the boot process and provides runtime services for operating systems.", 2,
                      ("Initializes hardware and starts the boot process", true), ("Runs application software", false), ("Manages network connections", false), ("Stores user files", false)),

                    Q("What is the function of a motherboard?",
                      "The motherboard is the main circuit board that connects all components of a computer, allowing them to communicate with each other.", 1,
                      ("Connecting all computer components for communication", true), ("Processing data and calculations", false), ("Storing permanent data", false), ("Providing power to the system", false)),

                    Q("What is the purpose of thermal paste?",
                      "Thermal paste fills microscopic gaps between the CPU and heatsink to improve heat transfer and prevent overheating.", 2,
                      ("Improving heat transfer between CPU and heatsink", true), ("Holding the CPU in the socket", false), ("Powering the CPU fan", false), ("Insulating electrical components", false)),
                }
            }
        }
    };

    // ─────────────────────────────────────────────
    // Google Cloud ACE
    // ─────────────────────────────────────────────
    private static Certification CreateGoogle_ACE() => new()
    {
        Vendor = "Google Cloud",
        Name = "Associate Cloud Engineer",
        Code = "ACE",
        Description = "Deploy applications, monitor operations, and manage enterprise solutions on Google Cloud Platform.",
        Category = "Cloud",
        Difficulty = "Intermediate",
        IsActive = true,
        CreatedAt = DateTime.UtcNow,
        Topics = new List<Topic>
        {
            new()
            {
                Name = "Setting Up a Cloud Solution Environment",
                OrderIndex = 1,
                Questions = new List<Question>
                {
                    Q("What is a Google Cloud project?",
                      "A project is the base-level organizing entity in GCP that holds all resources, manages billing, and controls access for your cloud services.", 1,
                      ("The base organizing entity that holds resources and manages billing", true), ("A virtual machine type", false), ("A networking configuration", false), ("A database instance", false)),

                    Q("What is the purpose of Google Cloud IAM?",
                      "Cloud IAM lets you manage access control by defining who (identity) has what access (role) for which resource.", 1,
                      ("Managing who has what access to which resources", true), ("Monitoring application performance", false), ("Deploying virtual machines", false), ("Storing encrypted data", false)),

                    Q("Which command-line tool is used to interact with Google Cloud?",
                      "The gcloud CLI is the primary command-line tool for creating and managing Google Cloud resources.", 1,
                      ("gcloud", true), ("gsutil", false), ("kubectl", false), ("bq", false)),

                    Q("What is a Google Cloud service account?",
                      "A service account is a special type of account used by applications and VMs (not humans) to make authorized API calls.", 2,
                      ("A non-human account used by applications to access GCP APIs", true), ("A personal Gmail account for cloud access", false), ("A billing account for payment", false), ("An admin account with full access", false)),

                    Q("How are Google Cloud resources organized hierarchically?",
                      "GCP resources are organized as: Organization → Folders → Projects → Resources. IAM policies can be inherited down this hierarchy.", 2,
                      ("Organization → Folders → Projects → Resources", true), ("Resources → Projects → Folders → Organization", false), ("Projects → Resources → Folders → Organization", false), ("Folders → Organization → Projects → Resources", false)),
                }
            },
            new()
            {
                Name = "Compute and Networking",
                OrderIndex = 2,
                Questions = new List<Question>
                {
                    Q("What is Google Compute Engine?",
                      "Compute Engine is Google Cloud's IaaS offering that lets you create and run virtual machines on Google infrastructure.", 1,
                      ("An IaaS service for creating and running virtual machines", true), ("A serverless function platform", false), ("A managed Kubernetes service", false), ("A database service", false)),

                    Q("What is Google Kubernetes Engine (GKE)?",
                      "GKE is a managed Kubernetes service for deploying, managing, and scaling containerized applications using Google infrastructure.", 2,
                      ("A managed service for running containerized applications with Kubernetes", true), ("A virtual machine hosting service", false), ("A serverless function platform", false), ("A relational database service", false)),

                    Q("What is Cloud Run?",
                      "Cloud Run is a fully managed compute platform that automatically scales stateless containers, abstracting away all infrastructure management.", 2,
                      ("A serverless platform for running stateless containers", true), ("A virtual machine service", false), ("A Kubernetes management tool", false), ("A network load balancer", false)),

                    Q("What is a VPC in Google Cloud?",
                      "A Virtual Private Cloud provides networking functionality for your GCP resources, including IP address management, firewall rules, and routing.", 1,
                      ("A virtual network providing networking for GCP resources", true), ("A type of virtual machine", false), ("A storage bucket", false), ("A container registry", false)),

                    Q("What is Cloud Load Balancing?",
                      "Cloud Load Balancing distributes user traffic across multiple instances of your application to ensure high availability and responsiveness.", 2,
                      ("A service that distributes traffic across multiple instances", true), ("A CDN service", false), ("A DNS management tool", false), ("A VPN service", false)),
                }
            },
            new()
            {
                Name = "Storage and Databases",
                OrderIndex = 3,
                Questions = new List<Question>
                {
                    Q("What is Cloud Storage in Google Cloud?",
                      "Cloud Storage is a unified object storage service for developers and enterprises, offering multiple storage classes for different access patterns.", 1,
                      ("An object storage service with multiple storage classes", true), ("A block storage service", false), ("A relational database", false), ("A file system service", false)),

                    Q("What is Cloud SQL?",
                      "Cloud SQL is a fully managed relational database service for MySQL, PostgreSQL, and SQL Server with built-in high availability and backups.", 1,
                      ("A managed relational database service for MySQL, PostgreSQL, and SQL Server", true), ("A NoSQL database service", false), ("An object storage service", false), ("A data warehouse service", false)),

                    Q("What is Cloud Spanner?",
                      "Cloud Spanner is a globally distributed, horizontally scalable relational database service that provides ACID transactions and SQL semantics at scale.", 3,
                      ("A globally distributed, scalable relational database with ACID transactions", true), ("A simple key-value store", false), ("A file storage service", false), ("A message queue service", false)),

                    Q("When would you use Firestore vs Cloud SQL?",
                      "Use Firestore for NoSQL document data with real-time sync and offline support. Use Cloud SQL for traditional relational data with SQL queries and ACID transactions.", 3,
                      ("Firestore for NoSQL/real-time; Cloud SQL for relational/SQL data", true), ("They are interchangeable", false), ("Firestore is always faster", false), ("Cloud SQL is only for backups", false)),

                    Q("What is BigQuery?",
                      "BigQuery is a serverless, highly scalable data warehouse designed for fast SQL analytics over large datasets.", 2,
                      ("A serverless data warehouse for fast SQL analytics on large datasets", true), ("A transactional database", false), ("A file storage system", false), ("A virtual machine service", false)),
                }
            }
        }
    };

    // ─────────────────────────────────────────────
    // Microsoft AZ-104 — Azure Administrator
    // ─────────────────────────────────────────────
    private static Certification CreateAZ104() => new()
    {
        Vendor = "Microsoft",
        Name = "Azure Administrator Associate",
        Code = "AZ-104",
        Description = "Demonstrate proficiency in implementing, managing, and monitoring Azure environments including virtual networks, storage, compute, and identity.",
        Category = "Cloud",
        Difficulty = "Advanced",
        IsActive = true,
        CreatedAt = DateTime.UtcNow,
        Topics = new List<Topic>
        {
            new()
            {
                Name = "Manage Azure Identities and Governance",
                OrderIndex = 1,
                Questions = new List<Question>
                {
                    Q("What is Azure Active Directory (Entra ID)?",
                      "Azure AD (now Microsoft Entra ID) is a cloud-based identity and access management service for signing in and accessing resources.", 1,
                      ("A cloud-based identity and access management service", true), ("A relational database service", false), ("A virtual network service", false), ("A storage account type", false)),

                    Q("What are Azure Management Groups used for?",
                      "Management Groups provide a level of scope above subscriptions, allowing you to efficiently manage access, policies, and compliance across multiple Azure subscriptions.", 2,
                      ("Organizing subscriptions for unified policy and access management", true), ("Managing individual virtual machines", false), ("Creating storage accounts", false), ("Deploying web applications", false)),

                    Q("What is the difference between Azure AD roles and Azure RBAC roles?",
                      "Azure AD roles manage access to Azure AD resources (users, groups), while Azure RBAC roles manage access to Azure resources (VMs, storage, networks).", 3,
                      ("AD roles manage AD resources; RBAC roles manage Azure resources", true), ("They are the same thing", false), ("AD roles are more powerful", false), ("RBAC roles only work on-premises", false)),

                    Q("What is a Conditional Access policy?",
                      "Conditional Access policies are if-then statements: if a user wants to access a resource, then they must complete an action (like MFA) based on conditions like location or device.", 3,
                      ("If-then policies that enforce access requirements based on conditions", true), ("A firewall rule for virtual networks", false), ("A cost management alert", false), ("A storage replication policy", false)),

                    Q("What is Azure Policy used for?",
                      "Azure Policy evaluates resources for non-compliance with business rules defined as policy definitions, helping maintain standards across your Azure environment.", 2,
                      ("Enforcing standards and assessing compliance across Azure resources", true), ("Managing user passwords", false), ("Deploying virtual machines", false), ("Routing network traffic", false)),
                }
            },
            new()
            {
                Name = "Implement and Manage Storage",
                OrderIndex = 2,
                Questions = new List<Question>
                {
                    Q("What are the four types of Azure Storage services?",
                      "Azure Storage provides Blob (object), File (SMB shares), Queue (messaging), and Table (NoSQL key-value) storage services.", 2,
                      ("Blob, File, Queue, and Table storage", true), ("SSD, HDD, Tape, and Flash storage", false), ("Hot, Cool, Cold, and Archive tiers only", false), ("SQL, NoSQL, Graph, and Time-series databases", false)),

                    Q("What is the difference between Hot, Cool, and Archive access tiers?",
                      "Hot tier is for frequently accessed data (highest storage cost, lowest access cost). Cool tier is for infrequent access (30-day min). Archive is for rarely accessed data (180-day min, hours to rehydrate).", 2,
                      ("Hot = frequent access; Cool = infrequent; Archive = rare access with rehydration delay", true), ("They all cost the same", false), ("Hot is slowest; Archive is fastest", false), ("They differ only in encryption levels", false)),

                    Q("What is Azure Storage redundancy option LRS?",
                      "Locally Redundant Storage (LRS) replicates data three times within a single datacenter, providing 99.999999999% durability.", 2,
                      ("Three copies of data within a single datacenter", true), ("Copies across multiple regions", false), ("A single copy with no redundancy", false), ("Copies across availability zones", false)),

                    Q("What is AzCopy?",
                      "AzCopy is a command-line utility for copying data to and from Azure Blob, File, and Table storage with optimized performance.", 2,
                      ("A command-line tool for copying data to/from Azure Storage", true), ("An Azure monitoring dashboard", false), ("A virtual machine image", false), ("A database migration tool", false)),

                    Q("How do you secure access to an Azure Storage account?",
                      "You can secure storage using Shared Access Signatures (SAS), access keys, Azure AD authentication, private endpoints, and firewall rules.", 3,
                      ("Using SAS tokens, access keys, Azure AD auth, and network rules", true), ("Only by setting a password", false), ("Storage is always publicly accessible", false), ("By encrypting the storage account name", false)),
                }
            },
            new()
            {
                Name = "Deploy and Manage Compute Resources",
                OrderIndex = 3,
                Questions = new List<Question>
                {
                    Q("What is an Azure Availability Set?",
                      "An Availability Set distributes VMs across multiple fault domains and update domains within a datacenter to minimize impact from hardware failures and planned maintenance.", 2,
                      ("Distributes VMs across fault and update domains for high availability", true), ("A set of available VM sizes", false), ("A pricing tier for VMs", false), ("A backup schedule for VMs", false)),

                    Q("What is the difference between Azure App Service and Azure Functions?",
                      "App Service is for hosting web apps, REST APIs, and mobile backends with always-on compute. Azure Functions is for event-driven serverless compute that scales to zero.", 2,
                      ("App Service is always-on web hosting; Functions is event-driven serverless", true), ("They are identical services", false), ("Functions is for web apps; App Service is for event handling", false), ("App Service is free; Functions is paid", false)),

                    Q("What is an Azure VM Scale Set?",
                      "VM Scale Sets let you create and manage a group of identical, load-balanced VMs that automatically increase or decrease in number based on demand.", 2,
                      ("A group of identical VMs that auto-scale based on demand", true), ("A set of different VM sizes to choose from", false), ("A backup solution for VMs", false), ("A networking configuration", false)),

                    Q("What is Azure Container Instances (ACI)?",
                      "ACI is the simplest way to run containers in Azure without managing servers, offering fast startup and per-second billing.", 2,
                      ("A serverless container hosting service with fast startup", true), ("A virtual machine service", false), ("A container registry", false), ("A Kubernetes cluster", false)),

                    Q("What is the Azure CLI?",
                      "The Azure CLI is a cross-platform command-line tool for managing Azure resources, offering commands structured as groups matching Azure services.", 1,
                      ("A cross-platform command-line tool for managing Azure resources", true), ("A graphical interface for Azure", false), ("An Azure monitoring service", false), ("A programming language for Azure", false)),
                }
            },
            new()
            {
                Name = "Configure and Manage Virtual Networking",
                OrderIndex = 4,
                Questions = new List<Question>
                {
                    Q("What is an Azure Virtual Network (VNet)?",
                      "A VNet is the fundamental building block for private networking in Azure, enabling secure communication between Azure resources, the internet, and on-premises networks.", 1,
                      ("The fundamental building block for private networking in Azure", true), ("A type of virtual machine", false), ("A storage account feature", false), ("A CDN endpoint", false)),

                    Q("What is VNet peering?",
                      "VNet peering connects two VNets seamlessly through the Azure backbone network, allowing resources in both VNets to communicate as if they were in the same network.", 2,
                      ("Connecting two VNets for seamless communication over Azure backbone", true), ("Connecting a VNet to the internet", false), ("Splitting a VNet into subnets", false), ("Encrypting VNet traffic", false)),

                    Q("What is Azure DNS?",
                      "Azure DNS is a hosting service for DNS domains, providing name resolution using Microsoft Azure infrastructure.", 1,
                      ("A hosting service for DNS domains using Azure infrastructure", true), ("A VPN service", false), ("A firewall service", false), ("A load balancer", false)),

                    Q("What is a Network Security Group (NSG)?",
                      "An NSG contains security rules that allow or deny inbound/outbound network traffic to resources in an Azure virtual network.", 2,
                      ("A set of rules to allow or deny network traffic to Azure resources", true), ("A group of network administrators", false), ("A type of VPN connection", false), ("A monitoring dashboard", false)),

                    Q("What is Azure ExpressRoute?",
                      "ExpressRoute provides private, dedicated connections between on-premises infrastructure and Azure datacenters, bypassing the public internet for higher security and reliability.", 3,
                      ("A private, dedicated connection between on-premises and Azure", true), ("A faster internet connection", false), ("A VNet peering feature", false), ("A CDN service", false)),
                }
            }
        }
    };

    // ─────────────────────────────────────────────
    // Helper to create questions concisely
    // ─────────────────────────────────────────────
    private static Question Q(string text, string explanation, int difficulty,
        (string text, bool correct) a, (string text, bool correct) b,
        (string text, bool correct) c, (string text, bool correct) d) => new()
    {
        QuestionText = text,
        Explanation = explanation,
        DifficultyLevel = difficulty,
        CreatedAt = DateTime.UtcNow,
        Options = new List<QuestionOption>
        {
            new() { OptionText = a.text, IsCorrect = a.correct, OrderIndex = 1 },
            new() { OptionText = b.text, IsCorrect = b.correct, OrderIndex = 2 },
            new() { OptionText = c.text, IsCorrect = c.correct, OrderIndex = 3 },
            new() { OptionText = d.text, IsCorrect = d.correct, OrderIndex = 4 },
        }
    };

    // ═══════════════════════════════════════════════════
    //  MODULES & LESSONS SEED DATA
    // ═══════════════════════════════════════════════════
    private static async Task SeedModulesAndLessons(ExamPrepDbContext context, List<Certification> certifications)
    {
        var az900 = certifications.First(c => c.Code == "AZ-900");
        var awsCcp = certifications.First(c => c.Code == "CLF-C02");

        var modules = new List<Module>
        {
            // AZ-900 Modules
            new()
            {
                CertificationId = az900.Id,
                Title = "Cloud Computing Fundamentals",
                OrderIndex = 1,
                Lessons = new List<Lesson>
                {
                    new()
                    {
                        Title = "What is Cloud Computing?",
                        Content = "Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet (\"the cloud\") to offer faster innovation, flexible resources, and economies of scale.\n\n## Key Characteristics\n\n- **On-demand self-service**: Provision computing capabilities automatically without requiring human interaction.\n- **Broad network access**: Capabilities are available over the network and accessed through standard mechanisms.\n- **Resource pooling**: Provider's computing resources are pooled to serve multiple consumers using a multi-tenant model.\n- **Rapid elasticity**: Capabilities can be elastically provisioned and released to scale rapidly.\n- **Measured service**: Cloud systems automatically control and optimize resource use by leveraging a metering capability.",
                        CodeExample = "// Example: Creating an Azure resource using Azure CLI\naz group create --name myResourceGroup --location eastus\naz vm create \\\n  --resource-group myResourceGroup \\\n  --name myVM \\\n  --image Ubuntu2204 \\\n  --admin-username azureuser \\\n  --generate-ssh-keys",
                        CodeLanguage = "bash",
                        ExternalLinks = "[{\"title\":\"Microsoft Learn - Cloud Concepts\",\"url\":\"https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/\"},{\"title\":\"Azure Fundamentals Learning Path\",\"url\":\"https://learn.microsoft.com/en-us/certifications/azure-fundamentals/\"}]",
                        OrderIndex = 1
                    },
                    new()
                    {
                        Title = "Cloud Service Models (IaaS, PaaS, SaaS)",
                        Content = "Cloud computing offers three main service models, each providing different levels of control, flexibility, and management.\n\n## Infrastructure as a Service (IaaS)\nProvides virtualized computing resources over the internet. You manage OS, middleware, runtime, data, and applications.\n**Examples**: Azure VMs, AWS EC2, Google Compute Engine\n\n## Platform as a Service (PaaS)\nProvides a platform allowing customers to develop, run, and manage applications without managing infrastructure.\n**Examples**: Azure App Service, AWS Elastic Beanstalk, Google App Engine\n\n## Software as a Service (SaaS)\nSoftware distribution model where applications are hosted by a service provider and made available over the internet.\n**Examples**: Microsoft 365, Salesforce, Google Workspace\n\n## Shared Responsibility Model\nThe responsibility for security and management shifts depending on the service model used.",
                        CodeExample = "// Comparison of responsibility in each model\n// IaaS: You manage -> OS, Runtime, Middleware, Data, Apps\n// PaaS: You manage -> Data, Apps\n// SaaS: You manage -> Data (mostly)\n\n// Example PaaS deployment with Azure App Service\naz webapp create \\\n  --resource-group myResourceGroup \\\n  --plan myAppServicePlan \\\n  --name myUniqueAppName \\\n  --runtime \"DOTNET|8.0\"",
                        CodeLanguage = "bash",
                        OrderIndex = 2
                    },
                    new()
                    {
                        Title = "Cloud Deployment Models",
                        Content = "## Public Cloud\nOwned and operated by third-party cloud service providers. Resources are shared across multiple organizations.\n- Lower costs, no maintenance, near-unlimited scalability\n\n## Private Cloud\nCloud computing resources used exclusively by a single business or organization.\n- More control, better security, higher costs\n\n## Hybrid Cloud\nCombines public and private clouds, allowing data and apps to be shared between them.\n- Greater flexibility, more deployment options, compliance support\n\n## Multi-Cloud\nUsing services from multiple cloud providers simultaneously.\n- Avoid vendor lock-in, leverage best-of-breed services",
                        OrderIndex = 3
                    }
                }
            },
            new()
            {
                CertificationId = az900.Id,
                Title = "Core Azure Services",
                OrderIndex = 2,
                Lessons = new List<Lesson>
                {
                    new()
                    {
                        Title = "Azure Compute Services",
                        Content = "Azure provides several compute services for running applications.\n\n## Azure Virtual Machines\nOn-demand, scalable computing resources. Full control over the operating system.\n\n## Azure App Service\nA fully managed platform for building, deploying, and scaling web apps.\n\n## Azure Functions\nServerless compute service that runs code on-demand without managing infrastructure.\n\n## Azure Kubernetes Service (AKS)\nSimplifies deploying a managed Kubernetes cluster in Azure.\n\n## Azure Container Instances\nRun Docker containers on-demand in a managed, serverless Azure environment.",
                        CodeExample = "// Create an Azure Function (C# example)\n[Function(\"HttpTrigger\")]\npublic static IActionResult Run(\n    [HttpTrigger(AuthorizationLevel.Anonymous, \"get\")] HttpRequest req,\n    ILogger log)\n{\n    log.LogInformation(\"C# HTTP trigger function processed a request.\");\n    return new OkObjectResult(\"Hello from Azure Functions!\");\n}",
                        CodeLanguage = "csharp",
                        OrderIndex = 1
                    },
                    new()
                    {
                        Title = "Azure Storage Services",
                        Content = "Azure provides several types of storage services.\n\n## Azure Blob Storage\nMassively scalable object storage for unstructured data.\n\n## Azure File Storage\nFully managed file shares in the cloud accessible via SMB protocol.\n\n## Azure Queue Storage\nMessaging store for reliable messaging between application components.\n\n## Azure Table Storage\nNoSQL key-attribute data store for rapid development.\n\n## Storage Tiers\n- **Hot**: Frequently accessed data\n- **Cool**: Infrequently accessed, stored for at least 30 days\n- **Archive**: Rarely accessed, stored for at least 180 days",
                        OrderIndex = 2
                    }
                }
            },
            new()
            {
                CertificationId = az900.Id,
                Title = "Azure Security & Governance",
                OrderIndex = 3,
                Lessons = new List<Lesson>
                {
                    new()
                    {
                        Title = "Azure Identity & Access Management",
                        Content = "## Microsoft Entra ID (Azure Active Directory)\nCloud-based identity and access management service.\n\n### Key Features\n- **Single Sign-On (SSO)**: Access multiple applications with one set of credentials\n- **Multi-Factor Authentication (MFA)**: Additional verification beyond passwords\n- **Conditional Access**: Policies that control access based on conditions\n- **Role-Based Access Control (RBAC)**: Fine-grained access management for Azure resources\n\n## Zero Trust Model\nNever trust, always verify. Every request is treated as if it originates from an uncontrolled network.\n\n### Principles\n1. Verify explicitly\n2. Use least privilege access\n3. Assume breach",
                        OrderIndex = 1
                    }
                }
            },
            // AWS Cloud Practitioner Modules
            new()
            {
                CertificationId = awsCcp.Id,
                Title = "AWS Cloud Foundations",
                OrderIndex = 1,
                Lessons = new List<Lesson>
                {
                    new()
                    {
                        Title = "Introduction to AWS",
                        Content = "Amazon Web Services (AWS) is the world's most comprehensive and broadly adopted cloud platform.\n\n## AWS Global Infrastructure\n- **Regions**: Geographic areas with multiple data centers\n- **Availability Zones (AZs)**: Isolated data centers within a region\n- **Edge Locations**: Content delivery endpoints for AWS CloudFront\n\n## AWS Well-Architected Framework\nFive pillars:\n1. **Operational Excellence**\n2. **Security**\n3. **Reliability**\n4. **Performance Efficiency**\n5. **Cost Optimization**",
                        CodeExample = "# AWS CLI examples\n# Configure AWS CLI\naws configure\n\n# List S3 buckets\naws s3 ls\n\n# Create an EC2 instance\naws ec2 run-instances \\\n  --image-id ami-0abcdef1234567890 \\\n  --instance-type t2.micro \\\n  --key-name MyKeyPair",
                        CodeLanguage = "bash",
                        ExternalLinks = "[{\"title\":\"AWS Cloud Practitioner Essentials\",\"url\":\"https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/\"}]",
                        OrderIndex = 1
                    },
                    new()
                    {
                        Title = "AWS Core Services Overview",
                        Content = "## Compute\n- **EC2**: Virtual servers in the cloud\n- **Lambda**: Run code without provisioning servers\n- **ECS/EKS**: Container orchestration services\n\n## Storage\n- **S3**: Object storage with 99.999999999% durability\n- **EBS**: Block storage for EC2 instances\n- **Glacier**: Low-cost archive storage\n\n## Database\n- **RDS**: Managed relational databases\n- **DynamoDB**: Managed NoSQL database\n- **ElastiCache**: In-memory caching\n\n## Networking\n- **VPC**: Isolated cloud network\n- **Route 53**: DNS service\n- **CloudFront**: Content delivery network",
                        OrderIndex = 2
                    }
                }
            }
        };

        context.Modules.AddRange(modules);
        await context.SaveChangesAsync();
    }

    // ═══════════════════════════════════════════════════
    //  MOCK TESTS SEED DATA
    // ═══════════════════════════════════════════════════
    private static async Task SeedMockTests(ExamPrepDbContext context, List<Certification> certifications)
    {
        var az900 = certifications.First(c => c.Code == "AZ-900");
        var awsCcp = certifications.First(c => c.Code == "CLF-C02");

        // Get questions for AZ-900
        var az900Questions = await context.Questions
            .Where(q => q.Topic.CertificationId == az900.Id)
            .OrderBy(q => q.Id)
            .Take(10)
            .ToListAsync();

        var awsQuestions = await context.Questions
            .Where(q => q.Topic.CertificationId == awsCcp.Id)
            .OrderBy(q => q.Id)
            .Take(10)
            .ToListAsync();

        var mockTests = new List<MockTest>();

        if (az900Questions.Count > 0)
        {
            mockTests.Add(new MockTest
            {
                Title = "AZ-900 Practice Test 1",
                Description = "A practice test covering cloud concepts, core Azure services, and Azure governance features.",
                Type = "mock",
                CertificationId = az900.Id,
                DurationMinutes = 30,
                NegativeMarking = false,
                PassingScore = 70,
                IsActive = true,
                TestQuestions = az900Questions.Select((q, i) => new TestQuestion
                {
                    QuestionId = q.Id,
                    OrderIndex = i + 1
                }).ToList()
            });

            mockTests.Add(new MockTest
            {
                Title = "AZ-900 Full Exam Simulation",
                Description = "A full-length exam simulation with timed questions and negative marking.",
                Type = "exam",
                CertificationId = az900.Id,
                DurationMinutes = 60,
                NegativeMarking = true,
                PassingScore = 70,
                IsActive = true,
                TestQuestions = az900Questions.Select((q, i) => new TestQuestion
                {
                    QuestionId = q.Id,
                    OrderIndex = i + 1
                }).ToList()
            });
        }

        if (awsQuestions.Count > 0)
        {
            mockTests.Add(new MockTest
            {
                Title = "AWS Cloud Practitioner Practice Test",
                Description = "Practice test covering AWS Cloud fundamentals, core services, and billing.",
                Type = "mock",
                CertificationId = awsCcp.Id,
                DurationMinutes = 45,
                NegativeMarking = false,
                PassingScore = 70,
                IsActive = true,
                TestQuestions = awsQuestions.Select((q, i) => new TestQuestion
                {
                    QuestionId = q.Id,
                    OrderIndex = i + 1
                }).ToList()
            });
        }

        if (mockTests.Count > 0)
        {
            context.MockTests.AddRange(mockTests);
            await context.SaveChangesAsync();
        }
    }

    // ═══════════════════════════════════════════════════
    //  CERTIFICATION PATHS SEED DATA
    // ═══════════════════════════════════════════════════
    private static async Task SeedCertPaths(ExamPrepDbContext context, List<Certification> certifications)
    {
        var az900 = certifications.First(c => c.Code == "AZ-900");
        var az104 = certifications.First(c => c.Code == "AZ-104");
        var awsCcp = certifications.First(c => c.Code == "CLF-C02");
        var awsSaa = certifications.First(c => c.Code == "SAA-C03");

        var mockTests = await context.MockTests.ToListAsync();

        var certPaths = new List<CertPath>
        {
            new()
            {
                Title = "Azure Cloud Engineer Path",
                Description = "Master Azure from fundamentals to advanced administration. This path takes you from cloud basics to managing enterprise Azure environments.",
                Goal = "Become a certified Azure Administrator",
                BadgeColor = "#0078D4",
                EstimatedWeeks = 16,
                IsActive = true,
                Courses = new List<CertPathCourse>
                {
                    new() { CertificationId = az900.Id, OrderIndex = 1, Description = "Start with cloud fundamentals and core Azure concepts" },
                    new() { CertificationId = az104.Id, OrderIndex = 2, Description = "Advance to Azure administration and management" }
                },
                Tests = mockTests
                    .Where(t => t.CertificationId == az900.Id)
                    .Select(t => new CertPathTest { MockTestId = t.Id })
                    .ToList()
            },
            new()
            {
                Title = "AWS Cloud Professional Path",
                Description = "Build your AWS expertise from cloud practitioner to solutions architect. Learn to design and deploy scalable systems on AWS.",
                Goal = "Become a certified AWS Solutions Architect",
                BadgeColor = "#FF9900",
                EstimatedWeeks = 20,
                IsActive = true,
                Courses = new List<CertPathCourse>
                {
                    new() { CertificationId = awsCcp.Id, OrderIndex = 1, Description = "Master AWS cloud fundamentals and core services" },
                    new() { CertificationId = awsSaa.Id, OrderIndex = 2, Description = "Learn to architect solutions on AWS" }
                },
                Tests = mockTests
                    .Where(t => t.CertificationId == awsCcp.Id)
                    .Select(t => new CertPathTest { MockTestId = t.Id })
                    .ToList()
            }
        };

        context.CertPaths.AddRange(certPaths);
        await context.SaveChangesAsync();
    }

    // ═══════════════════════════════════════════════════
    //  NEWS SEED DATA
    // ═══════════════════════════════════════════════════
    private static async Task SeedNews(ExamPrepDbContext context)
    {
        var news = new List<News>
        {
            new()
            {
                Title = "Microsoft Announces New Azure AI Services at Build 2025",
                Category = "AI",
                Url = "https://azure.microsoft.com/en-us/blog/",
                PublishedAt = DateTime.UtcNow.AddDays(-1)
            },
            new()
            {
                Title = "AWS Launches New Region in Southeast Asia",
                Category = "Cloud",
                Url = "https://aws.amazon.com/blogs/aws/",
                PublishedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                Title = "CompTIA Security+ SY0-701 Exam Updated with New Objectives",
                Category = "General",
                Url = "https://www.comptia.org/certifications/security",
                PublishedAt = DateTime.UtcNow.AddDays(-3)
            },
            new()
            {
                Title = "Python 3.13 Released with Performance Improvements",
                Category = "Programming",
                Url = "https://www.python.org/downloads/",
                PublishedAt = DateTime.UtcNow.AddDays(-5)
            },
            new()
            {
                Title = "Google Cloud Introduces Gemini 2.0 for Enterprise AI",
                Category = "AI",
                Url = "https://cloud.google.com/blog",
                PublishedAt = DateTime.UtcNow.AddDays(-4)
            },
            new()
            {
                Title = "Kubernetes 1.30 Released with Enhanced Security Features",
                Category = "Cloud",
                Url = "https://kubernetes.io/blog/",
                PublishedAt = DateTime.UtcNow.AddDays(-6)
            },
            new()
            {
                Title = ".NET 9 Officially Released with Blazor Improvements",
                Category = "Programming",
                Url = "https://devblogs.microsoft.com/dotnet/",
                PublishedAt = DateTime.UtcNow.AddDays(-7)
            },
            new()
            {
                Title = "Free Azure Certification Vouchers Available for Students",
                Category = "General",
                Url = "https://learn.microsoft.com/en-us/certifications/",
                PublishedAt = DateTime.UtcNow.AddDays(-8)
            }
        };

        context.News.AddRange(news);
        await context.SaveChangesAsync();
    }
}
