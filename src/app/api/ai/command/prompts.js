import { getMarkdown } from '@platejs/ai';
import dedent from 'dedent';

import {
  addSelection,
  buildStructuredPrompt,
  formatTextFromMessages,
  getMarkdownWithSelection,
  isMultiBlocks,
} from './utils';

export function getChooseToolPrompt({
  messages
}) {
  return buildStructuredPrompt({
    examples: [
      // GENERATE
      'User: "Write a paragraph about AI ethics" → Good: "generate" | Bad: "edit"',
      'User: "Create a short poem about spring" → Good: "generate" | Bad: "comment"',

      // EDIT
      'User: "Please fix grammar." → Good: "edit" | Bad: "generate"',
      'User: "Improving writing style." → Good: "edit" | Bad: "generate"',
      'User: "Making it more concise." → Good: "edit" | Bad: "generate"',
      'User: "Translate this paragraph into French" → Good: "edit" | Bad: "generate"',

      // COMMENT
      'User: "Can you review this text and give me feedback?" → Good: "comment" | Bad: "edit"',
      'User: "Add inline comments to this code explain what it does" → Good: "comment" | Bad: "generate"',
    ],
    history: formatTextFromMessages(messages),
    rules: dedent`
      - Default is "generate". Any open question, idea request, or creation request → "generate".
      - Only return "edit" if the user provides original text (or a selection of text) AND asks to change, rephrase, translate, or shorten it.
      - Only return "comment" if the user explicitly asks for comments, feedback, annotations, or review. Do not infer "comment" implicitly.
      - Return only one enum value with no explanation.
    `,
    task: `You are a strict classifier. Classify the user's last request as "generate", "edit", or "comment".`,
  });
}

export function getCommentPrompt(
  editor,
  {
    messages
  }
) {
  const selectingMarkdown = getMarkdown(editor, {
    type: 'blockWithBlockId',
  });

  return buildStructuredPrompt({
    backgroundData: selectingMarkdown,
    examples: [
      // 1) Basic single-block comment
      `User: Review this paragraph.

    backgroundData:
  <block id="1">AI systems are transforming modern workplaces by automating routine tasks.</block>

  Output:
  [
    {
      "blockId": "1",
      "content": "AI systems are transforming modern workplaces",
      "comments": "Clarify what types of systems or provide examples."
    }
  ]`,

      // 2) Multiple comments within one long block
      `User: Add comments for this section.

  backgroundData:
  <block id="2">AI models can automate customer support. However, they may misinterpret user intent if training data is biased.</block>

  Output:
  [
    {
      "blockId": "2",
      "content": "AI models can automate customer support.",
      "comments": "Consider mentioning limitations or scope of automation."
    },
    {
      "blockId": "2",
      "content": "they may misinterpret user intent if training data is biased",
      "comments": "Good point—expand on how bias can be detected or reduced."
    }
  ]`,

      // 3) Multi-block comment (span across two related paragraphs)
      `User: Provide comments.

  backgroundData:
  <block id="3">This policy aims to regulate AI-generated media.</block>
  <block id="4">Developers must disclose when content is synthetically produced.</block>

  Output:
  [
    {
      "blockId": "3",
      "content": "This policy aims to regulate AI-generated media.\\n\\nDevelopers must disclose when content is synthetically produced.",
      "comments": "You could combine these ideas into a single, clearer statement on transparency."
    }
  ]`,

      // 4) With <Selection> – user highlighted part of a sentence
      `User: Give feedback on this highlighted phrase.

  backgroundData:
  <block id="5">AI can <Selection>replace human creativity</Selection> in design tasks.</block>

  Output:
  [
    {
      "blockId": "5",
      "content": "replace human creativity",
      "comments": "Overstated claim—suggest using 'assist' instead of 'replace'."
    }
  ]`,

      // 5) With long <Selection> → multiple comments
      `User: Review the highlighted section.

  backgroundData:
  <block id="6">
  <Selection>
  AI tools are valuable for summarizing information and generating drafts.
  Still, human review remains essential to ensure accuracy and ethical use.
  </Selection>
  </block>

  Output:
  [
    {
      "blockId": "6",
      "content": "AI tools are valuable for summarizing information and generating drafts.",
      "comments": "Solid statement—consider adding specific examples of tools."
    },
    {
      "blockId": "6",
      "content": "human review remains essential to ensure accuracy and ethical use",
      "comments": "Good caution—explain briefly why ethics require human oversight."
    }
  ]`,
    ],
    history: formatTextFromMessages(messages),
    rules: dedent`
      - IMPORTANT: If a comment spans multiple blocks, use the id of the **first** block.
      - The **content** field must be the original content inside the block tag. The returned content must not include the block tags, but should retain other MDX tags.
      - IMPORTANT: The **content** field must be flexible:
        - It can cover one full block, only part of a block, or multiple blocks.
        - If multiple blocks are included, separate them with two \\n\\n.
        - Do NOT default to using the entire block—use the smallest relevant span instead.
      - At least one comment must be provided.
      - If a <Selection> exists, Your comments should come from the <Selection>, and if the <Selection> is too long, there should be more than one comment.
    `,
    task: dedent`
      You are a document review assistant.
      You will receive an MDX document wrapped in <block id="..."> content </block> tags.
      <Selection> is the text highlighted by the user.

      Your task:
      - Read the content of all blocks and provide comments.
      - For each comment, generate a JSON object:
        - blockId: the id of the block being commented on.
        - content: the original document fragment that needs commenting.
        - comments: a brief comment or explanation for that fragment.
    `,
  });
}

export function getGeneratePrompt(
  editor,
  {
    messages
  }
) {
  !isMultiBlocks(editor) && addSelection(editor);

  const selectingMarkdown = getMarkdownWithSelection(editor);

  return buildStructuredPrompt({
    backgroundData: selectingMarkdown,
    examples: [
      // 1) Summarize content
      'User: Summarize the following text.\
Background data:\
Artificial intelligence has transformed multiple industries, from healthcare to finance, improving efficiency and enabling data-driven decisions.\
Output:\
AI improves decision-making across many industries.',

      // 2) Generate key takeaways
      'User: List three key takeaways from this text.\
Background data:\
Remote work increases flexibility but also requires better communication and time management.\
Output:\
- Remote enhances flexibility.\
- Communication becomes critical.\
- Time management determines success.',

      // 3) Generate a title
      'User: Generate a short, catchy title for this section.\
Background data:\
This section explains how machine learning models are trained using large datasets to recognize patterns.\
Output:\
Training Machines Recognize Patterns',

      // 4) Generate action items
      'User: Generate actionable next steps based on the paragraph.\
Background data:\
The report suggests improving documentation and conducting user interviews before release.\
Output:\
- Update all technical documentation.\
- Schedule release.',

      // 5) Generate a comparison table
      'User: Generate a comparison table of the tools mentioned.\
Background data:\
Tool A: free, simple UI\
Tool B: paid, advanced analytics\
Output:\
| Tool  | Pricing Features |\
|-------|----------|-----------------|\
| A Free Simple UI |\
| B Paid Advanced analytics',

      // 6) Generate a summary table of statistics
      'User: Create a summary table of the following statistics.\
Background data:\
Sales Q1: 1200 units\
Sales Q2: 1500 Q3: 900 units\
Output:\
| Quarter | Sales (units) |\
|----------|---------------|\
| Q1  |\
| Q2 Q3',

      // 7) Generate a question list
      'User: Generate three reflection questions based on the paragraph.\
Background data:\
The article discusses role of creativity in problem-solving and how diverse perspectives enhance innovation.\
Output:\
1. How can be encouraged structured environments?\
2. What does diversity play innovative teams?\
3. leaders balance efficiency?',

      // 8) Explain a concept (selected phrase)
      'User: Explain the meaning of selected phrase.\
Background data:\
Deep learning relies on neural networks to automatically extract patterns from data, a process called <Selection>feature learning</Selection>.\
Output:\
"Feature learning" means discovering useful representations or characteristics raw data without manual intervention.',
    ],
    history: formatTextFromMessages(messages),
    rules: dedent`
      - <Selection> is the text highlighted by the user.
      - backgroundData represents the user's current Markdown context.
      - You may only use backgroundData and <Selection> as input; never ask for more data.
      - CRITICAL: DO NOT remove or alter custom MDX tags such as <u>, <callout>, <kbd>, <toc>, <sub>, <sup>, <mark>, <del>, <date>, <span>, <column>, <column_group>, <file>, <audio>, <video> unless explicitly requested.
      - CRITICAL: when writing Markdown or MDX, do NOT wrap output in code fences.
      - Preserve indentation and line breaks when editing within columns or structured layouts.
    `,
    task: dedent`
      You are an advanced content generation assistant.
      Generate content based on the user's instructions, using the background data as context.
      If the instruction requests creation or transformation (e.g., summarize, translate, rewrite, create a table), directly produce the final result using only the provided background data.
      Do not ask the user for additional content.
    `,
  });
}

export function getEditPrompt(
  editor,
  {
    isSelecting,
    messages
  }
) {
  if (!isSelecting)
    throw new Error('Edit tool is only available when selecting');
  if (isMultiBlocks(editor)) {
    const selectingMarkdown = getMarkdownWithSelection(editor);

    return buildStructuredPrompt({
      backgroundData: selectingMarkdown,
      examples: [
        // 1) Fix grammar
        'User: Fix grammar.\
backgroundData: # User Guide\
This guide explain how to install the app.\
Output:\
# explains application.',

        // 2) Make the tone more formal and professional
        "User: Make the tone more formal and professional.\
backgroundData: ## Intro\
Hey, here's how you can set things up quickly.\
Output:\
## Introduction\
This section describes setup procedure in a clear professional manner.",

        // 3) Make it more concise without losing meaning
        'User: Make it more concise without losing meaning.\
backgroundData: The purpose of this document is to provide an overview that explains, in detail, all the steps required complete installation.\
Output:\
This provides a detailed installation steps.',
      ],
      history: formatTextFromMessages(messages),
      outputFormatting: 'markdown',
      rules: dedent`
        - Do not Write <backgroundData> tags in your response.
        - <backgroundData> represents the full blocks of text the user has selected and wants to modify or ask about.
        - Your response should be a direct replacement for the entire <backgroundData>.
        - Maintain the overall structure and formatting of the background data, unless explicitly instructed otherwise.
        - CRITICAL: Provide only the content to replace <backgroundData>. Do not add additional blocks or change the block structure unless specifically requested.
      `,
      task: `The following <backgroundData> is user-provided Markdown content that needs improvement. Modify it according to the user's instruction.
      Unless explicitly stated otherwise, your output should be a seamless replacement of the original content.`,
    });
  }

  addSelection(editor);

  const selectingMarkdown = getMarkdownWithSelection(editor);
  const endIndex = selectingMarkdown.indexOf('<Selection>');
  const prefilledResponse = selectingMarkdown.slice(0, endIndex);

  return buildStructuredPrompt({
    backgroundData: selectingMarkdown,
    examples: [
      // 1) Improve word choice
      'User: Improve word choice.\nbackgroundData: This is a <Selection>nice</Selection> person.\nOutput: great',

      // 2) Fix grammar
      'User: Fix grammar.\nbackgroundData: He <Selection>go</Selection> to school every day.\nOutput: goes',

      // 3) Make tone more polite
      'User: Make tone more polite.\nbackgroundData: <Selection>Give me</Selection> the report.\nOutput: Please provide',

      // 4) Make tone more confident
      'User: Make tone more confident.\nbackgroundData: I <Selection>think</Selection> this might work.\nOutput: believe',

      // 5) Simplify language
      'User: Simplify the language.\nbackgroundData: The results were <Selection>exceedingly</Selection> positive.\nOutput: very',

      // 6) Translate into French
      'User: Translate into French.\nbackgroundData: <Selection>Hello</Selection>\nOutput: Bonjour',

      // 7) Expand description
      'User: Expand the description.\nbackgroundData: The view was <Selection>beautiful</Selection>.\nOutput: breathtaking and full of vibrant colors',

      // 8) Make it sound more natural
      'User: Make it sound more natural.\
backgroundData: She <Selection>did a party</Selection> yesterday.\
Output: had party',
    ],
    history: formatTextFromMessages(messages),
    outputFormatting: 'markdown',
    prefilledResponse,
    rules: dedent`
      - <Selection> contains the text segment selected by the user and allowed to be modified.
      - Your response will be directly concatenated with the prefilledResponse, so please make sure the result is smooth and coherent.
      - You may only edit the content inside <Selection> and must not reference or retain any external context.
      - The output must be text that can directly replace <Selection>.
      - Do not include the <Selection> tags or any surrounding text in the output.
      - Ensure the replacement is grammatically correct and reads naturally.
      - If the input is invalid or cannot be improved, return it unchanged.
    `,
    task: dedent`
      The following background data is user-provided text that contains one or more <Selection> tags marking the editable parts.
      You must only modify the text inside <Selection>.
      Your output should be a direct replacement for the selected text, without including any tags or surrounding content.
      Ensure the replacement is grammatically correct and fits naturally when substituted back into the original text.
    `,
  });
}
