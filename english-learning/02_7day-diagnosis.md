# 02. 7日間 英語力診断プログラム

> 目的: 本当のボトルネックを特定し、「知識不足」と「取り出し不足」を区別する。
> 同時に、毎月の定点観測の初回(Month 0)として録音とスコアを保存する。

---

## 5-1 設計原則

1. **条件の差で判別する。** 同じ能力を「時間制限あり/なし」「音声/スクリプト」「日本語/英語」「通常/止まらないルール」の2条件で測り、その差を見ます。
2. **毎月の定点観測の初回を兼ねる。** 録音・お題・スコアをすべて保存し、毎月同じ形式で再測定します。
3. **負荷の上限を決める。** 平日の通勤は集中タスク最大40分(残りは自由時間)、帰宅後は15〜20分。休日は60〜90分。
4. **事前に準備しない。** 診断中は各お題について事前に考えないでください。良い結果を出す意味はありません。
5. **測定は粗い。** 1回の測定は誤差が大きいので、数値は「方向」を見るためのものです。
6. **通勤中に画面操作や文字入力ができない区間がある場合は、** 通勤のテキスト作業と休日の作業を入れ替えて構いません。

**時間が足りない場合の最小セット:** 1分スピーチ×3(Day 1)、瞬間英作文(時間制限あり/なし, Day 2〜3)、Listening テスト(自然会話, Day 1)、受け身な相手との雑談、問題調査ロールプレイ(Day 6)、言えなかったリスト。

---

## 5-2 準備(Day 0・約30分)

1. **録音:** スマホのボイスメモ。ファイル名は `D1_M1` のように「日_タスク」にします。
2. **記録シート:** Google スプレッドシートかメモアプリに、`03_report-template.md` のスコアシートをコピー。
3. **機材:** 可能なら ChatGPT の音声会話は PC/タブレット、録音はスマホで(同時に使うため)。
4. **ChatGPT で Project「English Lab」を作成し、以下を Project の指示に貼ります。**

**P0 — Project の指示**
```
You are my English assessment partner for a 7-day diagnostic.
About me: Japanese adult, TOEIC L&R 813 three years ago. Goals: real-time speaking, listening, and business/leadership communication in English.
Rules during this diagnostic:
- Do NOT teach, correct, or praise during speaking tasks. Only run the task.
- In role-plays, speak at natural native speed with contractions. Do not simplify your English unless I explicitly ask. Keep your turns short (1–3 sentences) so that I speak more.
- When I ask for evaluation, be strict and specific. Use numbers and the criteria I give. No compliments.
- Always distinguish between: (A) knowledge gap — I don't know it; (B) retrieval gap — I know it but can't produce it fast; (C) chunk gap — I know the words but not the ready-made phrase; (D) planning gap — I don't know what to say or how to structure it; (E) monitoring/anxiety — I stop to self-correct.
- Explain your analysis in Japanese. Keep English examples in English.
- Never change my content; only improve the language.
```

5. **自己評価アンケート(1=全く当てはまらない 〜 5=とても当てはまる)** — 記録シートに記入
   - Q1 英語を話すとき、頭の中で日本語の文を作ってから訳している
   - Q2 文法が正しいか気になって、話している途中で止まる
   - Q3 単語が出てこないとき、別の言い方をせずに諦めることが多い
   - Q4 知っている単語なのに、音声だと聞き取れないことが多い
   - Q5 長い文を聞くと、前半を忘れる
   - Q6 英語を話すことに不安や緊張を感じる
   - Q7 日本語の雑談で、自分から質問して話を広げる方だ
   - Q8 日本語の会議で、自分の意見を結論から言える
   - Q9 日本語の会議で、他の人の意見を引き出す質問をする
   - Q10 平日の帰宅時点での疲労度(1=元気 〜 5=疲れ切っている)

---

## 5-3 共通の測定手順

### (a) 録音の分析(Gemini にファイルをアップロード)

**P1 — 録音分析**
```
Attached are recordings of my unprepared English speech. For EACH file:
1. Verbatim transcript. Keep every filler (uh, um, like), Japanese filler (えーと, あの, なんか), repetition, false start and self-correction. Mark silent pauses of about 2 seconds or longer as [P]. Do NOT fix grammar, word choice or pronunciation. If a word is unclear, write [?word].
2. Metrics table: duration (sec), word count (exclude fillers and repeated words), words per minute, English fillers, Japanese fillers, pauses [P], self-corrections/restarts, abandoned sentences, paraphrase attempts (explaining a word I couldn't find).
3. Grammar errors: list each with its type (article / tense / agreement / plural / preposition / word order / question form / other) and give errors per 100 words.
4. Vocabulary: estimated CEFR level; the 5 most advanced words or phrases I used; basic words I over-used.
5. Structure: Did I state my main point within the first 15 seconds? (Y/N) How many distinct ideas?
6. The 3 issues that most reduce how effectively I communicate (not a long list).
Answer in Japanese except for quotations. Approximate timings are fine.
```

- **WPM の検算:** 1本だけ手で確認します。WPM = 語数 ÷ 話した秒数 × 60。
- **1分スピーチの WPM の目安**(研究上の基準値ではなく、実務上の目安):
  - 80未満: 生成に大きな詰まりがある
  - 80〜110: 中級
  - 110〜140: 上級の入口
  - 140以上: 流暢(母語話者の会話はおおむね 130〜180)

### (b) Listening テスト(LT)の手順 — どのクリップにも共通

| Step | やること | 記録 |
|---|---|---|
| 1 | 字幕なし・1.0倍速で1回だけ聞く → 内容を日本語で3〜5行メモ → 理解度を自己評価(%) | L1 |
| 2 | もう1回、1.0倍速で聞く → 理解度(%) | L2 |
| 3 | 0.75倍速で聞く → 理解度(%) | L0.75 |
| 4 | 音声なしでスクリプトを読む → 「読めば分かる」理解度(%) | Script |
| 5 | 聞き取れなかった文を3〜5文ディクテーション → スクリプトと照合 → 誤りを分類 | ①〜④の件数 |

**ディクテーションの誤りの分類:**
- ① 知らない単語だった(語彙の知識)
- ② 知っている単語なのに音で認識できなかった(連結・脱落・弱形・短縮・t の変化)
- ③ 音は聞こえたが、長い文で意味の処理や記憶が追いつかなかった
- ④ 冠詞・語尾・機能語(a/the/-s/-ed/have など)を落とした

**P2 — Listening の採点(ChatGPT)**
```
Below are (1) the transcript of an audio clip, (2) my summary written after listening once without the script, and (3) my self-rated comprehension.
Split the transcript into 8–12 idea units. Tell me how many I captured correctly, partially, or missed, and give a comprehension % (partial = 0.5). Point out anything I misunderstood.
Then classify my dictation errors (listed below with the correct sentences) as:
① unknown word ② known word not recognized in speech (linking, reduction, weak forms, flapping) ③ heard the sounds but lost the meaning or memory in a long sentence ④ missed function words or endings (a/the/-s/-ed/have).
Answer in Japanese.
[transcript]
[my summary]
[self-rated %]
[dictation: my version / correct version]
```

---

## 5-4 7日間スケジュール(平日5日＋休日2日。月曜開始が最もきれいに収まります)

| Day | 通勤・行き | 通勤・帰り | 帰宅後・休日 | 主に測るもの |
|---|---|---|---|---|
| 0(日) | — | — | 準備・アンケート(30分) | 自己認識 |
| 1(月) | LT-a 自然な会話 | LT-b TED | SP 1分スピーチ×3 | Listening、流暢さ、モニター過剰 |
| 2(火) | Day 1 の録音を分析 | VT 語彙テスト | IC 瞬間英作文(時間制限あり) | 流暢さの数値、能動語彙と受容語彙の差、生成速度 |
| 3(水) | IC 時間無制限版と比較 | RD 読解速度 | PR 発音・通じやすさ | 知識と取り出し、Reading、発音 |
| 4(木) | 発音分析＋GR 文法比較 | 休み | RT リテリング | 文法の正確さ、Retelling |
| 5(金) | QF 質問作成＋言えなかったリスト判定＋RT 採点 | 休み | BZ 日本語 → 英語の意見表明＋即答Q&A | 質問力、概念化、反応速度 |
| 6(土) | — | — | CV 対話ロールプレイ×4(70〜90分) | 会話継続、質問力、ビジネス、旅行 |
| 7(日) | — | — | TOEIC L(任意)＋ループ適性＋集計(60〜120分) | TOEIC の現在地、フィードバックの効き方、総合 |

---

### Day 1(月)

**通勤・行き — LT-a 自然な会話(20〜25分)**
- RedKiwi で、会話形式(ドラマ・インタビューなど)の1分前後のクリップを1本選びます。
- 5-3(b) の手順で実施。字幕を隠せない・速度を変えられない場合は、YouTube のインタビュー動画(再生速度の変更と文字起こしの表示ができるもの)で代用して構いません。

**通勤・帰り — LT-b TED(20〜25分)**
- TEDICT で、2分程度の区間を選び、同じ手順で実施。
- 可能なら P2 で採点(Day 2 以降でも可)。

**帰宅後 — SP 1分スピーチ×3(15分)**
- お題を見て5秒後に話し始め、60秒で止めます(タイマーを使う)。各スピーチの直後に、**言いたかったのに英語で言えなかった語句を日本語でメモ**します(「言えなかったリスト」。Day 5 まで毎回追記します)。

| ファイル名 | お題 | 条件 |
|---|---|---|
| D1_M1 | Describe how you usually spend your weekends, and why. | 通常 |
| D1_M2 | What is one problem at your workplace that should be solved? Why does it matter? | 通常 |
| D1_M3 | Tell me about a trip you remember well. | **止まらないルール:** 2秒以上黙らない、文法は無視、詰まったら言い換えるか文を変える、日本語は禁止 |

---

### Day 2(火)

**通勤・行き — 録音の分析(20分)**
- D1_M1〜M3 を Gemini にアップロードし、P1 を実行 → 数値を記録シートへ。

**通勤・帰り — VT 語彙テスト(25分)**

**P3 — 語彙テスト(ChatGPT・Project 内)**
```
Run a vocabulary test in two parts. Do not give any feedback until both parts are finished.
Items: 30 in total — 12 general/business words (CEFR B2–C1, around the level of "mitigate" or "feasible"), 10 phrasal verbs or spoken collocations (around the level of "figure out" or "follow up on"), and 8 conversation/meeting chunks (around the level of "I was wondering if..." or "Let me make sure I understand...").
Part 1 (productive): Show ONE item at a time: the Japanese meaning + an English sentence with a blank + the first letter(s). I type the answer, then you show the next item.
Part 2 (receptive): After Part 1, show all 30 English items in a new random order. I type the Japanese meaning of each.
At the end: score Part 1 and Part 2 separately (count natural alternatives as correct), show the gap by category, and list the items I knew receptively but could not produce. Answer in Japanese.
Start Part 1 now.
```

**帰宅後 — IC 瞬間英作文・時間制限あり(15分)**
- ChatGPT(テキスト)で P4 を実行し、日本語を1文ずつ表示させます。スマホで録音しながら、口頭で英語にします。
- 各文を自己判定してメモします:
  - ◎ 3秒以内に言い始め、最後まで言えた
  - ○ 言い始めるまで3〜10秒かかった、または大きく言い直した
  - × 10秒以上かかった、または諦めた
- 録音ファイル名: `D2_IC`

**P4 — 瞬間英作文**
```
Instant composition test. Create 20 Japanese sentences and show them ONE AT A TIME. Show only the Japanese: no hints, no English. When I type "n", show the next one. Do not comment on anything.
- Items 1–7 (Level A): everyday or work sentences using basic grammar (present perfect, comparatives, passive, relative clauses, if-clauses, infinitives). About 8–12 English words each.
- Items 8–14 (Level B): business functions — making a request, proposing, raising a concern, confirming, disagreeing politely, asking for someone's opinion, deciding next actions.
- Items 15–20 (Level C): Japanese expressions that cannot be translated literally, each with a one-line context in brackets (for example: とりあえず, 前向きに検討します, 一旦持ち帰ります, それはちょっと…).
After item 20, show the full list of 20 Japanese sentences so that I can save it.
```

---

### Day 3(水)

**通勤・行き — IC 時間無制限版と比較(25分)**
1. 前夜と同じ20文を、**時間無制限・辞書なし**でテキストで英訳します。
2. `D2_IC` を Gemini で逐語書き起こしします(P1 の 1 だけで可)。
3. ChatGPT で P5 を実行します。

**P5 — 瞬間英作文の比較**
```
Here are: the 20 Japanese sentences; my SPOKEN answers (transcript of a timed recording); my self-rating for each (◎ started within 3s / ○ 3–10s or big restart / × over 10s or gave up); and my WRITTEN answers (no time limit, no dictionary).
For each item, mark the spoken and the written answer as: ✔ natural and correct / △ understandable but with errors / ✘ wrong or missing.
Then give:
- totals by level (A/B/C) for spoken and written, and the ◎ rate by level
- a label for each item: "knowledge gap" (the written answer is also wrong), "retrieval gap" (written OK but spoken slow or wrong), or "OK"
- for Level C, whether I translated literally or conveyed the intended meaning
- a natural spoken version for every item that was not ✔ in speech
Answer in Japanese.
```

**通勤・帰り — RD 読解速度(20分)**

**P6 — 読解速度**
```
Write a 400-word article on a business topic (for example, remote work, supply chains, or AI adoption) at the level of a quality business news site (CEFR B2–C1). After the article, state its exact word count. Don't show any questions yet. When I say "done" and tell you my reading time, give me 5 multiple-choice comprehension questions, one at a time. Then calculate my words per minute and accuracy.
```
- 余裕があれば、abceed で Part 5 を15問(1問20秒以内)。正答数を記録します。

**帰宅後 — PR 発音・通じやすさ(15分)**
1. **音読(`D3_PR_read`):** 練習せずに1回だけ読んで録音します。
   > Please call Stella. Ask her to bring these things with her from the store: Six spoons of fresh snow peas, five thick slabs of blue cheese, and maybe a snack for her brother Bob. We also need a small plastic snake and a big toy frog for the kids. She can scoop these things into three red bags, and we will go meet her Wednesday at the train station.
2. **音声入力テスト:** スマホのキーボードの音声入力を「英語(US)」にして、メモアプリに向かって読み上げます。1語ずつ区切って読み、正しく認識された数を数えます(音声入力は文脈で推測するので、あくまで目安です)。
   - 単語24語: light / right, play / pray, collect / correct, think / sink, three / tree, walk / work, hat / hut, full / fool, ship / sheep, very / berry, vote / boat, bird / bud
   - 文5つ(誤認識された語数を数える):
     1. Could you walk me through the numbers?
     2. I'd like to change my reservation to Thursday.
     3. We need to rethink our approach to this problem.
     4. What do you think is the root cause?
     5. Is there anything we're missing?
3. **(任意)** ELSA があれば、アセスメント機能で総合スコアと項目別スコアを記録します。

---

### Day 4(木)

**通勤・行き(25分)**

1. `D3_PR_read` を Gemini にアップロードし、P7 を実行します。

**P7 — 発音分析(Gemini)**
```
Attached is my recording of reading the "Please call Stella" paragraph without practice. Focus on how easy I am to understand (intelligibility), not on whether I have an accent.
1. List the words a listener might misunderstand, and why.
2. Rate each 1–5: word stress, sentence stress and rhythm, linking, vowel insertion after consonants (e.g., "desk-u"), r/l, th, vowel distinctions.
3. The 2 pronunciation features that would most improve my intelligibility.
If you cannot judge something reliably from the audio, say so. Answer in Japanese.
```

2. **GR 文法の比較:** D1_M1(週末の過ごし方)と同じ内容を、時間無制限で英語で書きます(3〜5分)。その後、P8 を実行します。

**P8 — 話し言葉と書き言葉の誤り比較**
```
Below are (1) the transcript of my unprepared 1-minute speech and (2) the same content written by me with no time limit.
Count grammar errors per 100 words in each, by type (article / tense / agreement / plural / preposition / word order / question form / other).
Tell me which error types appear in BOTH (likely knowledge gaps or fossilized errors) and which appear ONLY in speech (likely errors caused by processing load). Answer in Japanese.
```

**通勤・帰り:** 休み(好きな英語コンテンツを聞くか、何もしない)。

**帰宅後 — RT リテリング(20分)** ※同じ ChatGPT のチャットの中で続けて行います
1. **聞いて再話(RT-L):** 音声会話を開始し、P9 を話しかけます(またはテキストで送ってから音声に切り替えます)。話を聞いている間は画面を見ません。「Go ahead.」と言われたら、英語で再話します。可能ならスマホでも録音します(`D4_RT_L`)。
2. **読んで再話(RT-R):** 音声を終了し、テキストで P9' を送ります。表示された文を60秒だけ黙読し、画面を閉じて音声で再話します(`D4_RT_R`)。
3. 採点(P12)は Day 5 の通勤で行います。

**P9 — 聞いて再話(音声)**
```
Retelling test. Tell me a news-style story of about 150 words on a business or social topic, at natural speed, once. Do not repeat it or simplify it. After the story, say only "Go ahead." Then I will retell it. Do not respond until I say "Finished."
```

**P9' — 読んで再話(テキスト)**
```
Now write a different news-style story of about 150 words, similar in difficulty to the one you told me. I will read it for 60 seconds and then retell it by voice.
```

---

### Day 5(金)

**通勤・行き(25〜30分)**

1. **QF 質問作成テスト(P10)**

**P10 — 質問作成テスト**
```
Question-formation test. Show me 15 situations in Japanese, ONE AT A TIME. For each, I will type the English question I would actually say, within about 20 seconds. No feedback until the end. When I type my answer, show the next situation.
Cover: clarifying what someone means; checking facts; asking why something happened; testing a hypothesis ("Could it be that...?"); asking what we might be missing; asking for someone's opinion; drawing out a quiet person's concern; asking what options we have; asking who else should be involved; confirming next actions and deadlines; a small-talk follow-up question; asking a hotel clerk about an unexpected charge; asking someone to repeat or slow down; asking how to get somewhere; politely asking a busy colleague for help.
At the end, for each answer evaluate: the grammar of the question (word order, indirect questions), naturalness, open vs closed, and politeness level, and give a better version. Then summarize my patterns. Answer in Japanese.
```

2. **言えなかったリストの判定(P11)**

**P11 — 言えなかったリスト**
```
Below is a list of Japanese words and expressions that I wanted to say in English during the tests but couldn't.
For each item, one at a time, show 4 English options (1 natural answer + 3 plausible distractors). I will pick one and say whether I "knew it" or "guessed".
At the end, classify each item: (B) retrieval gap — I recognized it confidently; (A) knowledge gap — I guessed or chose wrong. Give the ratio B:A and the natural expressions for all items. Answer in Japanese.
[list]
```

3. **RT の採点(P12)** — Day 4 と同じチャットで実行します。

**P12 — リテリングの採点**
```
Score both of my retellings. Split each source story into 10 idea units. Count how many I conveyed (partial = 0.5), and list the words and phrases I reused from the source. Compare the listening-retell with the reading-retell and tell me what the difference suggests. Answer in Japanese.
```

**通勤・帰り:** 休み。

**帰宅後 — BZ 意見表明＋即答Q&A(15〜20分)**
1. **日本語で1分(`D5_BZ_J`):** 「あなたの職場で、もっと早く気づくべきだった問題の例を1つ挙げ、なぜ気づくのが遅れたのかを説明してください」
2. **同じお題を英語で1分(`D5_BZ_E`):** “Give one example of a problem at your workplace that should have been noticed earlier, and explain why it was noticed late.”
3. **即答Q&A:** ChatGPT の音声会話で P13。3秒以内に話し始めることを目指します。終了後、テキストで「Evaluate my 10 answers: did I answer the question directly, how long were my answers, what errors did I make, and did any answer suggest that I misunderstood the question? Answer in Japanese.」と送ります。
4. `D5_BZ_J` と `D5_BZ_E` の分析は Day 6 か Day 7 に Gemini(P1)で行います。日本語版については「Analyze the Japanese recording for structure only: main point within 15 seconds (Y/N), number of ideas, and whether the reasoning is clear.」と追記します。

**P13 — 即答Q&A(音声)**
```
Rapid-response test. Ask me 10 questions, one at a time: 3 personal, 4 about work, and 3 asking for my opinion. Keep each question to one sentence. After I answer, say only "OK" and ask the next question. Do not comment or correct. After the 10th answer, say "Done."
```

---

### Day 6(土)— 対話ロールプレイ(70〜90分)

Project 内で、ロールプレイごとに新しいチャットを作ります。音声で実施し、「Stop」で終了してから、同じチャットにテキストで評価プロンプトを送ります。ロールプレイの間に5分の休憩を入れます。

**CV-1 受け身な相手との雑談(5分)— 会話継続力**
```
Role-play. You are Alex, an American engineer visiting Tokyo for a week on business. We just met at a networking event. Personality: friendly but reserved. Rules: answer my questions in 1–2 short sentences; NEVER ask me any questions; never start a new topic. If I'm silent, just wait. Speak naturally. I will start. End when I say "Stop."
```
評価:
```
Evaluate this conversation. Count: my turns; my questions; follow-up questions that built on Alex's previous answer vs questions that opened a new topic; times I shared my own related experience; times the conversation stalled. Rate 1–5: keeping the conversation going, showing interest (reactions), depth. Give the 3 most useful moves I could have made at specific points, with English examples. Answer in Japanese.
```

**CV-2 問題調査(8〜10分)— 質問力・問題発見**
```
Role-play. You are Sam, a manager at a mid-sized company. Before starting, silently invent a realistic business problem with 5 hidden facts, including a root cause that is not obvious. Do NOT reveal them.
Start by saying only: "Hey, got a minute? Our customer complaints have doubled over the last two months, and I don't know why."
Rules: answer only what I ask. Vague questions get vague answers; specific, well-aimed questions get specific facts. Never volunteer the root cause. Keep your turns to 1–3 sentences, at natural speed.
My goal: find out what is happening, why, what we are missing, who to involve, and what to do next. End when I say "Stop."
```
評価:
```
Now reveal the 5 hidden facts. Then evaluate me:
- facts I uncovered (x/5) and whether I found the root cause
- list all my questions and classify each: clarifying / fact-finding / why-probing / hypothesis-testing / perspective-seeking / options / involvement / next action
- ratio of open vs closed questions
- whether I summarized, proposed a hypothesis, and agreed on a next step
Rate 1–5: questioning, structuring the problem, proposing next steps. Give 3 better questions I could have asked at specific moments. Answer in Japanese.
```
※ 隠れた事実は AI がその場で作るため、厳密さには限界があります。重視するのは「発見した事実の数」より「質問の数と種類」です。

**CV-3 他部署への協力依頼(5〜7分)— 巻き込む力・反対への対応**
```
Role-play. You are Jordan, a manager in the IT department. I will ask for your team's help on a cross-department project: two of your people for about two weeks. You are busy and skeptical. Raise 2–3 realistic objections (workload, priorities, unclear benefit to your team). Agree only if I explain the purpose clearly, show what's in it for your team, ask about your constraints, and propose a smaller or concrete first step. If I do those things, agree on specific next actions. Natural speed, short turns. I'll start. End when I say "Stop."
```
評価:
```
Evaluate this role-play. Rate 1–5 with reasons: clarity of the request and its purpose; benefit to the other side; asking about their constraints; handling objections (acknowledge → respond → propose); agreeing on concrete next actions (who/what/when); tone (polite but direct). Show 3 moments where a different sentence would have worked better, with English examples. Answer in Japanese.
```

**CV-4 旅行トラブル(5分)— 予期しない状況への対応**
```
Role-play. You are a front desk clerk at a busy hotel in Chicago. I'm checking in. Hidden problem: my reservation, made through a booking website, shows a different date, and the hotel is almost full. Midway, add one more complication (for example, the only available room costs more, or there is an extra fee I didn't expect). Speak at natural native speed with contractions and casual expressions. Do not slow down or simplify unless I explicitly ask. Be polite but firm. Start by greeting me. End when I say "Stop."
```
評価:
```
Evaluate this role-play. Count the repair and clarification strategies I used (asking you to repeat, asking you to slow down, confirming by paraphrasing, spelling, checking numbers). Rate 1–5: understanding, clarifying, negotiating, staying in control. Note the moments where I misunderstood or froze, and what I could have said. Answer in Japanese.
```

**(任意)オンライン英会話の無料体験(25分):** 講師に CV-1 と同じ「受け身な相手」の役を頼むか、通常の会話を行います。最後に「Please tell me honestly: what CEFR level is my speaking, and what is my biggest problem?」と聞きます。AI との差(緊張、聞き取り、反応の速さ)を記録します。

---

### Day 7(日)— 集計(60〜120分)

1. **(任意)TOEIC Listening の模試:** abceed の公式問題集などで Part 1〜4 を1回分(約45分)。正答数と換算スコアを記録します。
2. **ループ適性テスト(15分):**
   - D1_M2(職場の問題)の逐語書き起こし(Day 2 の P1 の結果)を ChatGPT に貼り、「Rewrite this speech into natural spoken English, one level above my current level. Keep my content.」と頼んでアップグレード版を作ります。P1 の分析結果と合わせて5分読みます。
   - アップグレード版を2分読んだら画面を閉じ、同じお題を60秒で話し直します(`D7_M2_retry`)。
   - Gemini(P1)で分析し、D1_M2 と比べます。フィードバックが1回でどれだけ効くか(= PFRR ループとの相性)を見ます。
3. **集計:** 記録シートを埋め、全データを P15 に貼って AI の診断案を得ます。
4. **報告:** `03_report-template.md` を埋めて送ってください。

**P15 — 総合分析**
```
Below are all my diagnostic results from this week. Based ONLY on this data:
1. For speaking, listening, vocabulary and grammar, judge which is the main cause: (A) knowledge, (B) retrieval, (C) chunks, (D) planning/structure, (E) monitoring/anxiety — and show the evidence.
2. Rank my top 5 bottlenecks by how much they limit real communication.
3. Point out where my self-assessment (questionnaire) differs from the data.
4. State which conclusions are uncertain and what additional data would settle them.
Be critical; do not be encouraging. Answer in Japanese.
[data]
```

---

## 5-5 判定ロジック(知識不足か、取り出し不足か)

※ 閾値は判断の目安であり、検証済みの基準値ではありません。複数の指標が同じ方向を示すかを見ます。

| 比較 | 結果 | 判定 | 処方の方向 |
|---|---|---|---|
| 瞬間英作文:筆記の正答率と口頭の ◎率 | 筆記 85%以上、口頭 ◎ 50%以下 | **B 取り出し不足** | 時間の圧力をかけた反復、想起練習 |
| 〃 | 特定のレベルで筆記 70%未満 | **A 知識不足**(そのレベル) | 明示的に学ぶ → すぐに使う |
| 瞬間英作文 Level C | 直訳して破綻している | **D 概念化** | 言いたいことを「やさしい日本語」に言い換えてから英語にする訓練 |
| 語彙:受容 − 生産 | 30ポイント以上の差 | **B/C** | 想起練習、自分の発話に組み込む |
| 語彙:受容(カテゴリ別) | 80%未満 | **A**(句動詞・会話チャンクで起きやすい) | インプットから塊ごと集める |
| 言えなかったリスト | 認識率 70%以上 | **B** | 想起練習 |
| 〃 | 認識率 50%未満 | **A** | 覚える必要がある |
| 文法:話し言葉と書き言葉の誤り率 | 話し言葉が書き言葉の2倍以上 | **B/E**(処理負荷による誤り) | 流暢さを優先し、多くの誤りは後回しでよい |
| 〃 | 同じ種類の誤りが両方にある | **A**(誤った知識・定着した誤り) | 明示的に修正し、重点的にドリル |
| M3(止まらないルール)と M1 | M3 の WPM が M1 の1.2倍以上で、自己修正が大きく減る | **E モニター過剰** | 流暢さモードの練習を明確に設ける |
| 1分スピーチ | 日本語フィラーがある | 日本語経由の処理 | 英語の時間稼ぎ表現を導入する |
| 日本語版の意見表明 | 日本語でも結論が15秒以内に出ない、話が散らかる | **D(言語以前の問題)** | 思考の構造化(7つの問い・結論から話す型)を日本語でも訓練 |
| 日本語版と英語版 | 日本語は明瞭、英語だけ崩れる | **B/C**(言語化の問題) | 生成の自動化 |
| LT:Script − L1 | 30ポイント以上の差 | **デコーディング** | ディクテーション、音変化の訓練 |
| LT:L0.75 − L1 | 20ポイント以上の差 | **処理速度** | 速度を段階的に上げる、多聴 |
| LT:Script | 80%未満 | **A**(語彙・文法・背景知識) | 語彙・背景知識 |
| ディクテーションの誤り | ②が最多 | 音変化 | 音変化の集中訓練 |
| 〃 | ③が最多 | 保持・処理 | 意味の塊で聞く訓練、リテリング |
| RT:読んで再話 − 聞いて再話 | 25ポイント以上の差 | Listening が主要なボトルネック | Listening を優先 |
| RT:両方 | 50%未満 | 産出、または記憶・要約の問題 | 要約・再話の訓練 |
| CV-1 | 質問5回未満、またはフォローアップ質問2回未満 | 会話管理のレパートリー不足(日本語でも同じならスタイルの問題) | 質問と反応の型 |
| CV-2 | 質問の種類が3種類以下、why・仮説の質問が無い | 問題発見の質問レパートリー不足 | 7つの問いの訓練 |
| PR:音声入力テスト | 単語の誤認識 25%以上、または文の誤認識 10%以上 | 通じやすさに課題 | 発音の優先度を上げる(ELSA を期間限定で) |
| RD:読解速度 | 150 WPM 未満 | TOEIC Reading で時間が足りなくなるリスク | 速読 |
