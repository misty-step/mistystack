---
name: deepen
description: "Before starting a vague, ambitious or summary-only request, or before handing a brief to another agent: rewrite it into the deeper version a top professional would ask for, grounded in the real code and files."
metadata:
  owner: phaedrus
  prevents: "Requests answered with a bigger version of the same task, from a digest instead of the source, and self-judged; subagent briefs that only make sense with the parent's conversation (Phaedrus, 2026-11-13)."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-12-13"
---

# Deepen

Asked to do something better, a model usually changes its vocabulary, not its method. It works from whatever summary is already in the conversation, does a bigger version of the same task, and then judges its own result. This skill is a short read-only pass that fixes all three before any work starts. It produces a rewritten request, never the work itself.

## Deepen a request

Use it on a request that is vague, ambitious, or arrives as someone's summary of a problem.

1. **Read the raw material first, without asking anyone.** Open the code, files, docs, logs, tickets and screenshots the request touches. A summary in the conversation is a pointer to the source, not the source. Keep each command quick and narrow; search the project and the paths the request names, not whole home or cache directories.
2. **Answer four questions,** in a few lines each, with concrete facts from what you read: file names, counts, real component names, commands and tools that exist here.
   1. What would a top professional in this field do here that the request does not ask for?
   2. What is the rawest material they would start from, instead of what has already been digested?
   3. Which specific methods and tools would they use?
   4. What, other than you or the requester, would show the result is right?
3. **Rewrite the request** to ask for exactly that: the deeper version, not a bigger one. Keep the requester's goal, scope and voice. Put the concrete facts in. Say what proves the result is right. Write it as their own request, ready to send.
4. **Hand it back.** Show the rewrite to the requester, or, when you are deepening your own task, state it in a line and work from it. Do not edit files, start the work or launch anything during the pass.

The four questions are Felix Rieseberg's "Depth" prompt from [How to be more ambitious](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/#depth). Grounding them in the source first is Nico Bailon's addition in [pi-better](https://github.com/nicobailon/pi-better).

## Check a brief before handing it off

Use it before dispatching a nontrivial brief to a subagent or another session. The receiver sees only the brief, the repository and its own tools.

1. **Read the brief as the receiver would.** List what it cannot resolve on its own: references that only the current conversation explains ("the bug we found", "option B"), decisions it relies on but does not state, and files, commands or setup it assumes.
2. **Check every path, symbol, line number, command and version** it names against the repository as it is now. List what is wrong or out of date, with the correct value.
3. **Find how the receiver will know it is done.** If the brief does not say, find the real check here: a test, a command, an output, a page to load.
4. **Rewrite only those gaps.** Put the missing facts in, correct what is wrong, add the check if it was missing. Keep the goal, scope, order and length as close to the original as you can, and add no work it does not ask for. If nothing needs fixing, return it unchanged.

## Where to run it

Inline is fine for a short request. For a large codebase, run the pass in a read-only subagent so the research stays out of your context, and take back only the rewrite. pi users can install [pi-better](https://github.com/nicobailon/pi-better) (`pi install npm:pi-better`), which runs this pass as a background helper and puts the rewrite in the input box.
