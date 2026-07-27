<?php
/**
 * All site copy lives here so templates stay presentational.
 * Text is transcribed verbatim from the approved LogiSetu design.
 */

declare(strict_types=1);

/* ---------------------------------------------------------------- HOME --- */

const HOME_HERO = [
    'eyebrow' => 'Global Logistics Infrastructure',
    'title'   => 'Engineering India’s Next-Generation Logistics Infrastructure',
    'lead'    => 'LogiSetu designs, develops and operates multimodal logistics parks, freight terminals and trade infrastructure across India — connecting global capital with local execution.',
    'pills'   => ['Headquartered in Dubai, UAE', 'Investor Network: UAE & UK'],
    'primary' => ['label' => 'Our Solutions',   'href' => 'solutions.php'],
    'ghost'   => ['label' => 'Partner With Us', 'href' => 'contact.php'],
];

const HOME_HERO_CARDS = [
    [
        'title' => 'Pan-India Focus',
        'body'  => 'Infrastructure development targeted across India’s key logistics and trade corridors',
    ],
    [
        'title' => 'UAE · UK Capital',
        'body'  => 'Backed by a growing network of international and NRI investors across the Gulf and United Kingdom',
    ],
    [
        'title' => 'End-to-End Delivery',
        'body'  => 'From site selection and design through construction, leasing and operations',
    ],
];

const HOME_STATEMENT = 'LogiSetu exists to close India’s logistics infrastructure gap — building the modern warehousing, freight terminals, cold chain and trade facilitation capacity that a fast-growing economy needs to move at the speed of its ambition.';

const HOME_OPPORTUNITY = [
    'eyebrow' => 'The India Opportunity',
    'title'   => 'A market built for scale',
    'body'    => [
        'India’s logistics sector is shifting from fragmented, unorganised movement of goods toward modern, technology-enabled infrastructure. Industry estimates place India’s logistics market on a path from roughly <strong>$240 billion today to $425 billion-plus by 2030</strong>, driven by manufacturing growth, e-commerce, infrastructure investment and cross-border trade.',
        'Much of that growth needs somewhere to happen — modern logistics parks, cold chain networks and multimodal terminals built for scale. That is where LogiSetu is positioned.',
    ],
    'checks'  => [
        'Manufacturing & industrial expansion',
        'E-commerce & cold chain demand',
        'Cross-border & regional trade corridors',
        'National logistics & infrastructure policy tailwinds',
    ],
];

/** Nodes for the 3D demand-cluster visual beside "A market built for scale". */
const HOME_OPPORTUNITY_NODES = [
    ['label' => 'India-Wide',       'sub' => 'Logistics infrastructure focus', 'pos' => [0, 0, 0],        'hub' => true],
    ['label' => 'Manufacturing',    'sub' => 'Industrial hubs',                'pos' => [-2.4, 1.5, -0.6]],
    ['label' => 'E-Commerce',       'sub' => 'Fulfilment demand',              'pos' => [2.5, 1.9, -0.3]],
    ['label' => 'Cross-Border',     'sub' => 'Trade corridors',                'pos' => [2.4, -1.3, 0.5]],
    ['label' => 'Agri & Cold Chain','sub' => 'Farm to market',                 'pos' => [-0.6, -2.4, 0.4]],
];

const HOME_SERVICES = [
    'eyebrow' => 'What We Do',
    'title'   => 'Infrastructure for every link in the chain',
    'lead'    => 'LogiSetu builds the physical and digital infrastructure that modern supply chains run on.',
];

const HOME_WHY = [
    'eyebrow' => 'Why LogiSetu',
    'title'   => 'Global capital, built for local execution',
    'items'   => [
        [
            'icon'  => 'globe',
            'title' => 'Global Capital, Local Execution',
            'body'  => 'An international investor base across the UAE and UK, paired with on-ground teams across India.',
        ],
        [
            'icon'  => 'layers',
            'title' => 'Infrastructure-First',
            'body'  => 'We build the physical and digital backbone first — land, warehousing, terminals, and technology.',
        ],
        [
            'icon'  => 'corridor',
            'title' => 'Cross-Border Expertise',
            'body'  => 'A deep understanding of the trade corridors linking India with the Gulf and onward global markets.',
        ],
        [
            'icon'  => 'shield',
            'title' => 'Long-Term Capital',
            'body'  => 'Patient, infrastructure-grade capital suited to multi-phase, multi-year development.',
        ],
    ],
];

const HOME_NETWORK = [
    'eyebrow' => 'Our Network',
    'title'   => 'A global network, built for India',
    'body'    => 'LogiSetu is headquartered in Dubai and supported by a network of strategic and NRI investors across the UAE and United Kingdom — capital and relationships aligned with one goal: building India’s logistics infrastructure for the next decade.',
    'cta'     => ['label' => 'Explore Our Network', 'href' => 'network.php'],
];

/** Chapter markers for the network film. `at` is the segment start in seconds. */
const HOME_FILM = [
    'eyebrow'  => 'How We Move',
    'title'    => 'One network. Every mode.',
    'lead'     => 'Road, rail, sea and air — brought together into a single integrated logistics hub.',
    /*
     * Seek points verified against the rendered film frame by frame. The film
     * is one continuous camera move rather than hard cuts, so each mark sits
     * mid-segment where that mode most clearly reads.
     */
    'chapters' => [
        ['label' => 'Road', 'at' => 3,  'note' => 'Highway & last-mile haulage'],
        ['label' => 'Rail', 'at' => 6,  'note' => 'Dedicated freight corridors'],
        ['label' => 'Sea',  'at' => 9,  'note' => 'Deep-sea container shipping'],
        ['label' => 'Air',  'at' => 12, 'note' => 'Time-critical air cargo'],
        ['label' => 'Hub',  'at' => 14, 'note' => 'Where every mode converges'],
    ],
];

const HOME_CTA = [
    'eyebrow' => 'Partner With Us',
    'title'   => 'Let’s build India’s logistics infrastructure, together',
    'lead'    => 'Whether you are an investor, a state agency, or a business looking for logistics infrastructure partners — we’d like to hear from you.',
    'cta'     => ['label' => 'Get in Touch', 'href' => 'contact.php'],
];

/* ----------------------------------------------------------- SOLUTIONS --- */

/** Shared by the home "What We Do" grid (short copy) and the Solutions page (long copy + tags). */
const SOLUTIONS = [
    [
        'icon'  => 'warehouse',
        'title' => 'Grade A Warehousing & Logistics Parks',
        'short' => 'Modern, scalable storage and distribution infrastructure built to institutional standards.',
        'long'  => 'Institutional-grade warehousing and integrated logistics parks with container freight stations, designed for long-term operators and 3PLs.',
        'tags'  => ['Warehousing', '3PL', 'Container Freight'],
    ],
    [
        'icon'  => 'terminal',
        'title' => 'Multimodal Freight Terminals',
        'short' => 'Rail, road and container-yard integration for efficient, high-volume freight movement.',
        'long'  => 'Rail, road and truck terminal integration that reduces transshipment cost and time across long-haul freight corridors.',
        'tags'  => ['Rail', 'Road', 'Freight'],
    ],
    [
        'icon'  => 'coldchain',
        'title' => 'Cold Chain & Agri-Logistics',
        'long_title' => 'Cold Chain & Agri-Logistics Infrastructure',
        'short' => 'Temperature-controlled infrastructure connecting agriculture and pharma to market faster.',
        'long'  => 'Temperature-controlled storage and handling infrastructure that reduces post-harvest losses and connects agriculture and pharma to market faster.',
        'tags'  => ['Agriculture', 'Pharma', 'Cold Storage'],
    ],
    [
        'icon'  => 'ecommerce',
        'title' => 'E-Commerce Fulfilment Infrastructure',
        'short' => 'Purpose-built facilities for last-mile and express delivery operators.',
        'long'  => 'Purpose-built fulfilment and sortation infrastructure for express delivery and e-commerce operators scaling across India.',
        'tags'  => ['E-Commerce', 'Last-Mile', 'Fulfilment'],
    ],
    [
        'icon'  => 'customs',
        'title' => 'Customs & Cross-Border Trade Facilitation',
        'short' => 'On-site clearance capability that shortens the distance between production and export.',
        'long'  => 'On-site customs clearance capability that shortens the distance between production and export markets.',
        'tags'  => ['Customs', 'Export', 'Cross-Border'],
    ],
    [
        'icon'  => 'tech',
        'title' => 'Logistics Technology & Digital Supply Chain',
        'short' => 'Software and data infrastructure that make physical logistics assets visible and efficient.',
        'long'  => 'Supply-chain visibility software, warehouse management systems and data infrastructure that make physical assets efficient to operate.',
        'tags'  => ['Software', 'Data', 'Visibility'],
    ],
];

const SOLUTIONS_HERO = [
    'eyebrow' => 'Solutions',
    'title'   => 'End-to-end logistics infrastructure, engineered for scale',
    'lead'    => 'From land to lease, LogiSetu designs, builds and operates the infrastructure that modern Indian supply chains depend on.',
];

const SOLUTIONS_AUDIENCE = [
    'eyebrow' => 'Who We Build For',
    'title'   => 'Infrastructure for every kind of shipper',
    'items'   => [
        ['title' => 'Manufacturers',       'body' => 'Industrial and manufacturing supply chains that need reliable, scalable storage and distribution.'],
        ['title' => 'E-Commerce & Retail', 'body' => 'Fulfilment and last-mile operators scaling delivery networks across India.'],
        ['title' => 'Agriculture & Pharma','body' => 'Cold chain-dependent supply chains that need to move fast without losing quality.'],
        ['title' => 'Trade & Export',      'body' => 'Businesses moving goods across India’s borders and into international markets.'],
    ],
];

const SOLUTIONS_CTA = [
    'title' => 'Looking for logistics infrastructure partners?',
    'lead'  => 'Tell us what you’re building and we’ll tell you how LogiSetu fits in.',
    'cta'   => ['label' => 'Talk to Us', 'href' => 'contact.php'],
];

/* --------------------------------------------------------------- ABOUT --- */

const ABOUT_HERO = [
    'eyebrow' => 'About LogiSetu',
    'title'   => 'Built to close India’s logistics infrastructure gap',
    'lead'    => 'We are a logistics infrastructure company built to solve one of India’s biggest structural challenges: the gap between economic ambition and the physical and digital infrastructure needed to move goods efficiently.',
];

const ABOUT_MISSION = [
    'eyebrow' => 'Our Mission',
    'title'   => 'Infrastructure that moves India forward',
    'body'    => [
        'India’s economy is growing faster than its logistics infrastructure. Fragmented warehousing, limited cold chain, and underdeveloped multimodal connectivity add cost and friction at every stage of the supply chain — from farm to factory to final mile.',
        'LogiSetu was founded to close that gap: to design, build and operate the modern logistics infrastructure that India’s manufacturing, e-commerce, agriculture and trade sectors need to compete globally.',
    ],
];

/** Phased capacity bars for the 3D mission visual. */
const ABOUT_PHASES = [
    ['label' => 'Phase 1', 'value' => 0.34],
    ['label' => 'Phase 2', 'value' => 0.52],
    ['label' => 'Today',   'value' => 0.78, 'active' => true, 'caption' => '2026 →'],
    ['label' => 'Scale',   'value' => 1.00],
];

const ABOUT_APPROACH = [
    'eyebrow' => 'Our Approach',
    'title'   => 'How we build',
    'items'   => [
        ['no' => '01', 'title' => 'Infrastructure First',     'body' => 'We start with land, design and construction — the physical assets that everything else depends on — before layering on operations and technology.'],
        ['no' => '02', 'title' => 'Technology-Enabled',       'body' => 'Every facility is built with visibility and data in mind, so operators and partners can track, plan and optimise from day one.'],
        ['no' => '03', 'title' => 'Capital Discipline',       'body' => 'Phased development keeps capital deployment manageable and de-risks each stage, for us and for our partners.'],
        ['no' => '04', 'title' => 'Long-Term Partnership',    'body' => 'We build relationships designed to last multiple development cycles — with investors, operators, and government partners alike.'],
    ],
];

const ABOUT_TEAM = [
    'eyebrow' => 'Leadership & Team',
    'title'   => 'A team built across two geographies',
    'lead'    => 'LogiSetu is led by a team with experience spanning logistics infrastructure, international trade and capital markets across India and the Gulf. Our leadership pairs on-the-ground execution capability in India with a global network of capital and advisory relationships across the UAE and UK.',
];

const ABOUT_OPERATE = [
    'eyebrow' => 'Where We Operate',
    'title'   => 'Local execution, global reach',
    'items'   => [
        ['icon' => 'building', 'title' => 'Dubai',     'body' => 'Global headquarters — strategy, capital structuring and cross-border trade relationships.'],
        ['icon' => 'pin',      'title' => 'India',     'body' => 'On-the-ground project execution, government liaison and operations across target states.'],
        ['icon' => 'people',   'title' => 'UAE & UK',  'body' => 'Our network of NRI and international investors, advisors and strategic partners.'],
    ],
];

/* ----------------------------------------------- NETWORK & INVESTMENT --- */

const NETWORK_HERO = [
    'eyebrow' => 'Network & Investment',
    'title'   => 'Local execution in India. Global capital behind it.',
    'lead'    => 'LogiSetu connects on-the-ground logistics infrastructure delivery in India with a strategic investor and NRI capital network spanning the UAE and United Kingdom.',
];

const NETWORK_FOOTPRINT = [
    'eyebrow' => 'Our Footprint',
    'title'   => 'Three geographies, one mission',
    'items'   => [
        [
            'icon'  => 'building',
            'title' => 'Dubai — Global Headquarters',
            'body'  => 'Strategy, capital structuring and cross-border trade relationships are anchored from our Dubai headquarters — a natural bridge between global capital and the Indian subcontinent.',
        ],
        [
            'icon'  => 'people',
            'title' => 'UK & NRI Capital Network',
            'body'  => 'LogiSetu is supported by a growing base of strategic investors and NRI capital partners across the United Kingdom — individuals and family offices aligned with our long-term vision for Indian logistics infrastructure.',
        ],
        [
            'icon'  => 'pin',
            'title' => 'India — Execution on the Ground',
            'body'  => 'Project delivery, government liaison and day-to-day operations are run by teams based in India, close to the land, the regulators, and the customers we build for.',
        ],
    ],
];

const NETWORK_CAPITAL = [
    'eyebrow' => 'Strategic Capital, Global Reach',
    'title'   => 'Why global capital, built for India',
    'body'    => [
        'Logistics infrastructure requires patient, long-horizon capital — the kind that understands multi-phase development and multi-year timelines. LogiSetu’s investment network across the UAE and UK brings exactly that: capital comfortable with infrastructure-grade returns, paired with a genuine interest in India’s growth story.',
        'Much of this network is built through the NRI and diaspora community — investors and family offices with roots in India and capital based abroad, looking for credible, professionally run ways to participate in India’s infrastructure build-out.',
    ],
    'checks'  => [
        'Strategic and NRI investor relationships across the UAE and UK',
        'Infrastructure-grade, long-horizon capital approach',
        'Local execution teams accountable for on-the-ground delivery',
    ],
];

const NETWORK_IR = [
    'eyebrow' => 'Investor Relations',
    'title'   => 'Interested in India’s logistics infrastructure story?',
    'lead'    => 'We work with a select group of strategic and NRI investors across the UAE and UK. If you’d like to learn more about LogiSetu’s investment approach, get in touch directly.',
    'cta'     => ['label' => 'Contact Investor Relations', 'href' => 'contact.php?reason=investor'],
];

/*
 * The globe's hubs and freight corridors live in assets/js/routes.js, since
 * they are geographic coordinates rather than page copy.
 */

/* ------------------------------------------------------------ INSIGHTS --- */

const INSIGHTS_HERO = [
    'eyebrow' => 'Insights',
    'title'   => 'Perspectives on India’s logistics infrastructure build-out',
    'lead'    => 'Views from the LogiSetu team on what it takes to modernise Indian logistics.',
];

const INSIGHTS_ARTICLES = [
    [
        'kicker' => 'LogiSetu Insights',
        'year'   => '2026',
        'read'   => '5 min read',
        'title'  => 'Why India’s Logistics Costs Still Run High — and What Infrastructure Can Fix',
        'body'   => [
            'Logistics costs in India remain high relative to more mature markets, and the reasons are structural rather than incidental. Fragmented warehousing, limited cold chain capacity, and multimodal connectivity that hasn’t kept pace with freight volumes all add friction — and cost — at almost every handoff in the supply chain.',
            'None of this is a demand problem. India’s consumption and manufacturing base is growing quickly. The gap is on the supply side: there simply isn’t enough modern, Grade A logistics infrastructure to match where the economy is headed.',
            'Closing that gap requires purpose-built infrastructure — multimodal terminals that cut transshipment time, cold chain networks that reduce spoilage, and warehousing designed for how goods actually move today, not decades ago. That is the core thesis behind LogiSetu’s approach: build the physical backbone first, and efficiency follows.',
        ],
    ],
    [
        'kicker' => 'LogiSetu Insights',
        'year'   => '2026',
        'read'   => '4 min read',
        'title'  => 'The Case for Multimodal Logistics Parks in India',
        'body'   => [
            'Most logistics infrastructure in India has historically been developed piecemeal — a warehouse here, a container yard there — without the integration that lets rail, road and storage work together as a single system.',
            'Multimodal logistics parks change that equation. By co-locating warehousing, freight terminals, and customs facilitation in one location, they cut the number of handoffs a shipment goes through, which is where most delay and cost actually accumulates.',
            'As India’s National Logistics Policy and infrastructure programmes push toward integrated freight movement, well-located multimodal parks are likely to become the default model for new logistics capacity — not a niche alternative to it.',
        ],
    ],
    [
        'kicker' => 'LogiSetu Insights',
        'year'   => '2026',
        'read'   => '4 min read',
        'title'  => 'Cross-Border Trade Corridors: An Underused Growth Lever',
        'body'   => [
            'India’s trade relationships with its neighbours and the wider region are growing, but the infrastructure supporting that trade — customs facilitation, border logistics, and multimodal connectivity to ports and land borders — often lags behind the underlying demand.',
            'For businesses trying to move goods across borders, this shows up as cost and delay that has little to do with the goods themselves and everything to do with process and infrastructure gaps.',
            'We think this is one of the most underused levers for growth in Indian logistics: infrastructure that specifically targets cross-border friction, rather than treating border trade as an afterthought to domestic logistics planning.',
        ],
    ],
];

/* ------------------------------------------------------------- CONTACT --- */

const CONTACT_HERO = [
    'eyebrow' => 'Contact',
    'title'   => 'Let’s talk',
    'lead'    => 'Partnership enquiries, investor relations, or general questions — reach out and the LogiSetu team will get back to you.',
];

const CONTACT_REASONS = [
    'General Enquiry',
    'Investor Relations',
    'Partnership / Development',
    'Leasing & Space Enquiry',
    'Media & Press',
];

/* -------------------------------------------------------------- FOOTER --- */

const FOOTER_COLUMNS = [
    'Company' => [
        ['label' => 'About',     'href' => 'about.php'],
        ['label' => 'Solutions', 'href' => 'solutions.php'],
        ['label' => 'Insights',  'href' => 'insights.php'],
    ],
    'Global' => [
        ['label' => 'Network & Investment', 'href' => 'network.php'],
        ['label' => 'Contact',              'href' => 'contact.php'],
        ['label' => 'Investor Relations',   'href' => 'contact.php?reason=investor'],
    ],
];
