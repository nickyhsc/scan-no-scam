# SafeCheck — AI Scam Safety Assistant

*An efficient scam risk detector/helper for daily text messages and emails.*

## TRY HERE❕
https://scan-no-scam-green.vercel.app/

## Key Features
- **AI-Powered Analyze**: Analyzed by NVIDIA Nemotron-3.5-lightning-30b-a3b
- **Fallback Analyze**: Falls back to Claude if Nemotron fails
- **Audio Accessibility**: Integrated ElevenLabs text-to-speech to audibly deliver enerated scam analysis, improving accessibility and reducing the need for users to read lengthy outputs

## Built With
*NVIDIA Nemotron, Claude-API, ElevenLabs, JavaScript*

## Inspiration
We receive countless emails and text messages every day. Amid this constant stream of information, it's easy to overlook warning signs and be misled by scam messages or fake content.
We wanted to build more than just another scam detector. 
Instead of simply labeling a message as safe or suspicious, we envisioned a tool that helps users understand three essential questions:

**HOW is this message risky?** Identify potential warning signs and suspicious patterns.
**WHY should I be concerned?** Explain the specific evidence behind the risk assessment.
**WHAT is the sender trying to archieve?** Identify the sender's possible intentions, such as obtaining personal information, prompting a payment, or encouraging users to click a suspicious link.

## What it does
SafeCheck allows users to paste or type a suspicious text message or email into an input box for the analysis.

### How SafeCheck process

1. Submit a Message: Users enter the message they want to evaluate.
2. Analyze Risk: NVIDIA Nemotron analyzes the content and classifies its risk level as Low, Suspicious, or High.
3. Understand the Reasoning: The analysis explains potential warning signs, provides supporting evidence, and identifies the sender's possible intentions.
4. Listen to the Results: With ElevenLabs text-to-speech, users can listen to the generated analysis instead of reading the entire response.

⚠️ Fallback Analysis: If Nemotron fails, the system falls back to Claude to attempt the analysis.

We aim to make evaluating suspicious messages more understandable, accessible, and practical for everyday use.

## How We Built It
We started by outlining the core structure and workflow of SafeCheck, then sketched our initial web UI on paper. Since both of us had limited experience with web development, we used Claude to help us rapidly prototype and build out the UI through an iterative, AI-assisted coding process. We then integrated different AI models through their APIs to power message analysis, fallback handling, and text-to-speech functionality.

## Challenges We Ran Into
One of our biggest challenges was integrating and troubleshooting API connections. NVIDIA Nemotron did not always respond as expected, which made it difficult to maintain a reliable analysis workflow. To address this, we implemented a Claude API fallback so the application could attempt to analyze messages when Nemotron failed. Working through these issues helped us better understand API integration, error handling, and the importance of building resilient applications.

## Accomplishments We're Proud Of
We're proud of turning our initial idea into a working web application while exploring technologies that were new to us. We successfully connected multiple AI services through their APIs and brought together message analysis and audio accessibility in one tool. Most importantly, we gained hands-on experience building a functional prototype and learned how to turn an idea into something users can interact with.

## What We Learned
Throughout the project, we strengthened our understanding of JavaScript, web development workflows, and integrating external AI services through APIs. We also learned how to use AI-assisted coding tools more effectively, troubleshoot integration issues, and adapt our implementation when a service did not work as expected. This experience showed us that building an AI-powered application involves more than prompting a model—it also requires thoughtful UI design, reliable integrations, and a focus on the user experience.

## What's next for Scan No Scam
- Scanning or uploading pictures functions for text and email picture
- Interactable Frequently-Asked-Questions (FAQ) function with ElevenLabs, providing users to have real-time communication with the scam safety assistant
