# SafeCheck — AI Scam Safety Assistant

*An efficient scam risk detector/helper for daily text messages and emails.*
- Analyzed by Nvidia Nemotron-3.5-lightning-30b-a3b
- Falls back to Claude if Nemotron fails
- Integrated ElevenLabs text-to-speech to audibly deliver enerated scam analysis, improving accessibility and reducing the need for users to read lengthy outputs


### Inspiration
Being university students, we have had our fair share of scam emails and messages. Oftentimes, there will be messages that pose an unclear risk. We decided to build a tool that will help bridge that uncertainty.

### What it does
The user can type suspicious text into the text box, and the Nemotron AI will scan, analyze, and detect whether the text is at high, low, or suspicious risk. We included a fallback: when Nemotron fails, Claude AI will analyze the text instead. ElevenLabs text-to-voice is also integrated to assess messages.

### How we built it
We first outlined the structure of our project. We then designed the web UI on paper, and since we both have limited experience with web dev, we decided to vibecode the UI with Claude to build its functionality.

### Challenges we ran into
We had issues connecting the API keys. For one, Nemotron often wouldn't work, so that is why we included a Claude API fallback.

### Accomplishments that we're proud of
We were proud of learning more about the web development process and being able to connect to different AI models using the API keys.

### What we learned
We learned a lot more about JavaScript and connecting our project with different AI models.

### What's next for Scan No Scam
- Scanning or uploading pictures functions for text and email picture
- Interactable Frequently-Asked-Questions (FAQ) function with ElevenLabs, providing users to have real-time communication with the scam safety assistant
