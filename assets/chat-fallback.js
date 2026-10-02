/* chat-fallback.js — if /api/chat is unreachable (static-only hosting),
   answer with the same local engine the server uses. No-op when the API works. */
(function () {
  'use strict';

function getLocalFallbackResponse(message, tone) {
  const query = message.toLowerCase();
  let topic = 'general';

  if (query.includes('who') || query.includes('about') || query.includes('isha') || query.includes('ishha') || query.includes('profile')) {
    topic = 'general';
  } else if (query.includes('title') || query.includes('crown') || query.includes('pageant') || query.includes('mrs') || query.includes('universe') || query.includes('international') || query.includes('kerala')) {
    topic = 'pageantry';
  } else if (query.includes('tech') || query.includes('metaverse') || query.includes('ai') || query.includes('web 3') || query.includes('ifq technologies') || query.includes('gems') || query.includes('work') || query.includes('career') || query.includes('job') || query.includes('finesse') || query.includes('sdlc')) {
    topic = 'techCareer';
  } else if (query.includes('struggle') || query.includes('mother') || query.includes('young') || query.includes('infosys') || query.includes('early') || query.includes('college') || query.includes('study') || query.includes('born') || query.includes('school') || query.includes('thrissur') || query.includes('sleep') || query.includes('night')) {
    topic = 'earlyLife';
  } else if (query.includes('charity') || query.includes('philanthropy') || query.includes('volunteer') || query.includes('peace') || query.includes('diplomatic') || query.includes('un') || query.includes('sdg') || query.includes('children') || query.includes('wmf') || query.includes('tolerance')) {
    topic = 'philanthropy';
  } else if (query.includes('talk') || query.includes('speak') || query.includes('host') || query.includes('keynote') || query.includes('panel') || query.includes('sharjah') || query.includes('wea')) {
    topic = 'talks';
  } else if (query.includes('contact') || query.includes('email') || query.includes('meet') || query.includes('hire') || query.includes('collaborate') || query.includes('partner') || query.includes('message')) {
    topic = 'contact';
  } else {
    topic = 'unknown';
  }

  // Pre-coded responses for the 4 tones (updated for AI Concierge branding)
  const responses = {
    general: {
      elegant: "Dr. Ishha Farha Quraishy is a distinguished public figure, crowned Mrs UAE United Nations, and celebrated as the 'Beauty Queen with Brain & Knowledge of UAE'. She elegantly blends pageantry with technological innovation, serving as a diplomat for peace and a visionary entrepreneur.",
      executive: "Dr. Ishha Farha Quraishy is a technology expert, Metaverse, AI & Web 3.0 Innovation Evangelist, and the Founder & CEO of IFQ Technologies. She has steered emerging tech solutions in major firms like GEMS Education, SDLC, and Finesse.",
      inspirational: "Dr. Quraishy's life is a testament to resilience. Raised by a single mother and taking charge of her family at 15, she went from working night shifts at Infosys and sleeping 1 hour a day to becoming a crowned Mrs. Universe 2019 Solidarity winner, proving that no obstacle can block dedicated ambition.",
      friendly: "Dr. Ishha is an entrepreneur, tech expert, international speaker, and former Mrs. Universe. She's passionate about tech innovation (like AI and the Metaverse) as well as helping others through charity. She's based in Dubai!"
    },
    pageantry: {
      elegant: "She holds the prestigious titles of Mrs. Universe 2019 – Solidarity (representing the Middle East among 92 nations), Mrs. International 2018, and Mrs. UAE United Nations 2023. Her pageantry is a platform of grace, purpose, and global presence.",
      executive: "In addition to her technological background, she has achieved significant international recognition in pageantry, including winning Mrs. International 2018, Mrs. Universe 2019 – Solidarity, and representing the region as Mrs. UAE United Nations 2023.",
      inspirational: "Dr. Ishha walked her first ramp at the Mrs. Kerala 2017 event, securing 2nd runner-up. Through pure determination, she went on to win Mrs. International 2018 and represent the Middle East at Mrs. Universe 2019, showing that it's never too late to pursue new dreams.",
      friendly: "She has won some major titles! She won Mrs. International 2018, was crowned Mrs. Universe 2019 – Solidarity, and represented the UAE as Mrs. UAE United Nations 2023. She started pageantry with Mrs. Kerala in 2017."
    },
    techCareer: {
      elegant: "As the Founder & CEO of IFQ Technologies, Dr. Quraishy is an evangelist of innovation, focusing on AI, Web 3.0, and the Metaverse to shape the future of digital experiences with sophistication and vision.",
      executive: "Dr. Ishha is a Metaverse, AI & Web 3.0 Innovation Evangelist, serving as Founder/CEO of IFQ Technologies. She was previously Middle East Head for SDLC (Metaverse), Practice Head for Cloud/Infrastructure at Finesse, and led EdTech PMO strategies at GEMS Education.",
      inspirational: "Driven by a thirst for learning, she completed diplomas in Bioinformatics and Clinical Research while working night shifts. Today, she is a leading female voice in the male-dominated Metaverse and AI industries, inspiring women worldwide to lead in tech.",
      friendly: "She is the Founder and CEO of IFQ Technologies. She's an expert in emerging tech like AI, Web 3.0, and the Metaverse, and has worked in tech leadership roles for companies like GEMS Education, Finesse, and SDLC."
    },
    earlyLife: {
      elegant: "Dr. Quraishy's early life in Thrissur, Kerala, was shaped by poise and quiet strength. Raised by a single mother, she embraced family responsibilities from age 15, turning challenges into a foundation for her outstanding future.",
      executive: "Her early career began at Infosys as a process executive in 2006, selected via campus placement. She managed rigorous workloads, pursuing her Master's in Biotechnology and diplomas simultaneously to build her multidisciplinary foundation.",
      inspirational: "Raised by a single mother, Dr. Ishha took responsibility for her family at just 15. At Infosys, she worked night shifts and slept only 1 hour a day on the company bus. Despite this, she was a college topper, fine arts secretary, and won the Best Student of Kerala award!",
      friendly: "She was raised by a single mother in Thrissur, Kerala, and started helping her family when she was 15. While working nights at Infosys, she slept just an hour a day on the bus and still managed to top her college classes. A true superwoman!"
    },
    philanthropy: {
      elegant: "She serves as an Ambassador for the Diplomatic Mission for Global Peace. Her noble mission is to make education accessible to every underprivileged child using technology, aligning with the United Nations Sustainable Development Goals.",
      executive: "She acts as Ambassador for the Diplomatic Mission for Global Peace. She leads a tech-driven educational initiative aimed at achieving United Nations SDGs, focusing on global education accessibility for children.",
      inspirational: "Believing that 'beauty with purpose' is the ultimate calling, Dr. Ishha volunteers actively for the underprivileged and People of Determination. She's launched global missions to give every child access to education through tech.",
      friendly: "She is an Ambassador for the Diplomatic Mission for Global Peace. She does a lot of charity work, especially focusing on making education accessible for all children using new technology, and volunteering for People of Determination."
    },
    talks: {
      elegant: "A coveted speaker, Dr. Quraishy has graced stages such as WEA Talks for women of extraordinary achievements, and presented for the Sharjah Government at Al Qasba on educational technology transformation.",
      executive: "She is an international speaker and celebrity tech host. Her talks focus on how emerging technology can revolutionize education, notably presenting for the Sharjah Government and WEA Talks.",
      inspirational: "Dr. Ishha uses her voice to uplift. Whether sharing leadership insights at WEA Talks or speaking on the future of education for the Sharjah Government, she shows how art, music, and tech can change lives.",
      friendly: "She is an international speaker and tech host! She's given talks at WEA Talks (for high-achieving women) and for the Sharjah Government, discussing how tech can make education better."
    },
    contact: {
      elegant: "Dr. Quraishy welcomes collaborations with luxury brands, media profiles, and speaking engagements that align with her values. Please leave your details in the contact form below, and my office will reach out to you.",
      executive: "For professional consultations, speaking engagements (AI/Metaverse/Leadership), or corporate sponsorships, please utilize the contact form at the bottom of the page or email her team directly.",
      inspirational: "If you're looking for an international speaker to inspire your audience with stories of tech, leadership, and resilience, she would love to connect. Reach out through the contact form below!",
      friendly: "You can get in touch with her for speaking gigs, brand partnerships, or tech advisory! Just fill out the contact form at the bottom of this website, and her team will get back to you soon."
    },
    unknown: {
      elegant: "As Dr. Ishha's AI Concierge, I want to answer with the utmost accuracy. For detailed or specific inquiries, please feel free to leave a message in the contact form below, or ask me about her pageantry, tech ventures, or inspiring journey.",
      executive: "I do not have specific records matching that query in my current database. For detailed information or business opportunities, please fill out the contact form at the bottom of this page.",
      inspirational: "Every question is a step toward understanding. While I don't know the answer to that specific question, as Dr. Ishha's AI Concierge, I can tell you all about how she overcame hurdles to achieve her dreams. Ask me about her childhood or career!",
      friendly: "I'm not quite sure about that one! Try asking me about her pageant crowns, her company IFQ Technologies, her charity work, or how she started her career. You can also send her a message through the contact form below!"
    }
  };

  let response = responses[topic][tone];
  
  // If API key is missing, add a tiny, clean disclaimer in the fallback response for the developer demo
  if (!process.env.OPENAI_API_KEY) {
    response += "\n\n*(Note: This is a pre-configured response for the demo. Connect an OPENAI_API_KEY in the environment for full conversational AI).*";
  }

  return response;
}

// System Prompts for OpenAI based on Tones (updated for AI Concierge branding)
  var realFetch = window.fetch.bind(window);
  window.fetch = function (url, opts) {
    if (typeof url === 'string' && url.indexOf('/api/chat') !== -1) {
      return realFetch(url, opts).then(function (r) {
        if (!r.ok) throw new Error('api unavailable: ' + r.status);
        return r;
      }).catch(function () {
        var body = {};
        try { body = JSON.parse((opts && opts.body) || '{}'); } catch (e) {}
        var reply = getLocalFallbackResponse(body.message || '', body.tone || 'elegant');
        return new Response(JSON.stringify({ reply: reply }),
          { status: 200, headers: { 'Content-Type': 'application/json' } });
      });
    }
    return realFetch(url, opts);
  };
})();
