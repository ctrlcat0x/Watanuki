'use client';

import { ArrowUp, Bot, LoaderCircle, RotateCcw, Sparkles, X } from 'lucide-react';
import type { TextGenerationPipeline } from '@huggingface/transformers';
import {
  createContext,
  type FormEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { buttonVariants } from '@/components/ui/button';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller';
import { cn } from '@/utils/cn';

type PageContext = { title: string; url: string; markdown: string };
type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };
type DocsAIContextValue = {
  setPageContext: (context: PageContext) => void;
};

const DocsAIContext = createContext<DocsAIContextValue | null>(null);
const EXAMPLE_QUESTIONS = [
  'Summarize this page',
  'What are the key concepts?',
  'Show me a practical example',
];

export function DocsAIProvider({
  children,
}: {
  children: ReactNode;
}) {
  const modelRef = useRef<TextGenerationPipeline | null>(null);
  const modelPromiseRef = useRef<Promise<TextGenerationPipeline> | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState<'waiting' | 'loading' | 'ready' | 'error'>('waiting');
  const [progress, setProgress] = useState(0);
  const [statusLabel, setStatusLabel] = useState('Waiting to load');

  const ensureModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current;
    if (modelPromiseRef.current) return modelPromiseRef.current;
    setStatus('loading');
    setStatusLabel('Loading local model');
    modelPromiseRef.current = import('./docs-ai-model')
      .then(({ loadDocsAIModel }) =>
        loadDocsAIModel((nextProgress, label) => {
          setProgress(nextProgress);
          setStatusLabel(label);
        }),
      )
      .then((model) => {
        modelRef.current = model;
        setStatus('ready');
        setProgress(100);
        setStatusLabel('Ready on this device');
        return model;
      })
      .catch((error: unknown) => {
        setStatus('error');
        setStatusLabel(error instanceof Error ? error.message : 'Local AI failed to start');
        modelPromiseRef.current = null;
        throw error;
      });
    return modelPromiseRef.current;
  }, []);

  useEffect(() => {
    const beginLoading = () => {
      if (!('gpu' in navigator)) {
        setStatus('error');
        setStatusLabel('WebGPU is not available in this browser');
        return;
      }
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => void ensureModel().catch(() => undefined), { timeout: 4000 });
      } else {
        globalThis.setTimeout(() => void ensureModel().catch(() => undefined), 750);
      }
    };
    if (document.readyState === 'complete') beginLoading();
    else window.addEventListener('load', beginLoading, { once: true });
    return () => {
      window.removeEventListener('load', beginLoading);
    };
  }, [ensureModel]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !open) return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const handleSubmit = useCallback(
    (question = input) => {
      const prompt = question.trim();
      if (!prompt || generating || status === 'error' || !pageContext) return;
      const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: prompt };
      const assistantId = crypto.randomUUID();
      const history = [...messages, userMessage].slice(-8);
      setMessages([...history, { id: assistantId, role: 'assistant', content: '' }]);
      setInput('');
      setGenerating(true);
      void Promise.all([ensureModel(), import('./docs-ai-model')])
        .then(([generator, { generateDocsAnswer }]) =>
          generateDocsAnswer({
            generator,
            id: assistantId,
            page: pageContext,
            messages: history,
            handleDelta: (id, text) => {
              setMessages((current) =>
                current.map((message) =>
                  message.id === id ? { ...message, content: message.content + text } : message,
                ),
              );
            },
          }),
        )
        .then(() => setGenerating(false))
        .catch((error: unknown) => {
          setGenerating(false);
          setStatus('error');
          setStatusLabel(error instanceof Error ? error.message : 'Local AI failed to answer');
        });
    },
    [ensureModel, generating, input, messages, pageContext, status],
  );

  const contextValue = useMemo(() => ({ setPageContext }), []);
  const isReady = status === 'ready';

  return (
    <DocsAIContext.Provider value={contextValue}>
      <div
        className="grid min-h-dvh transition-[grid-template-columns] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateColumns: open ? 'minmax(0, 3fr) minmax(20rem, 1fr)' : 'minmax(0, 1fr) 0px' }}
      >
        <div className={cn('min-w-0', open && 'max-md:hidden')}>{children}</div>
        <aside
          aria-label="Ask AI"
          className={cn(
            'sticky top-0 z-50 flex h-dvh min-w-0 flex-col overflow-hidden border-s bg-fd-background transition-opacity duration-200 motion-reduce:transition-none',
            open ? 'opacity-100' : 'pointer-events-none opacity-0',
            'max-md:fixed max-md:inset-0 max-md:w-full',
          )}
        >
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <Sparkles className="size-4" aria-hidden="true" />
            <h2 className="font-semibold">Ask AI</h2>
            <button
              type="button"
              className={cn(buttonVariants({ color: 'ghost', size: 'icon-sm' }), 'ms-auto')}
              onClick={() => setMessages([])}
              aria-label="Start a new chat"
            >
              <RotateCcw aria-hidden="true" />
            </button>
            <button
              type="button"
              className={buttonVariants({ color: 'ghost', size: 'icon-sm' })}
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close Ask AI"
            >
              <X aria-hidden="true" />
            </button>
          </header>

          <div className="flex items-center gap-2 border-b px-4 py-2 text-xs text-fd-muted-foreground" role="status">
            <span
              className={cn(
                'size-1.5 shrink-0 rounded-full',
                isReady ? 'bg-emerald-500' : status === 'error' ? 'bg-red-500' : 'bg-amber-500',
              )}
            />
            <span className="truncate">{statusLabel}</span>
            {status === 'loading' ? <span className="ms-auto tabular-nums">{Math.round(progress)}%</span> : null}
          </div>

          <MessageScroller className="flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="min-h-full px-4 py-5">
                {messages.length === 0 ? (
                  <div className="m-auto flex max-w-sm flex-col items-center text-center">
                    <span className="mb-4 grid size-10 place-items-center rounded-xl bg-fd-accent">
                      <Bot className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-semibold">Ask about this page</h3>
                    <p className="mt-1 text-sm text-fd-muted-foreground">
                      Answers run privately on your device with LFM2-350M.
                    </p>
                    <div className="mt-6 flex w-full flex-col gap-2">
                      {EXAMPLE_QUESTIONS.map((question) => (
                        <button
                          key={question}
                          type="button"
                          className="rounded-lg border px-3 py-2 text-start text-sm transition-colors hover:bg-fd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
                          onClick={() => handleSubmit(question)}
                          disabled={!pageContext || status === 'error'}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={message.role === 'user'}
                      className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                          message.role === 'user'
                            ? 'bg-fd-primary text-fd-primary-foreground'
                            : 'bg-fd-accent text-fd-accent-foreground',
                        )}
                      >
                        {message.content || <LoaderCircle className="size-4 animate-spin" aria-label="Thinking" />}
                      </div>
                    </MessageScrollerItem>
                  ))
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>

          <form
            className="shrink-0 border-t p-3"
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <div className="flex items-end gap-2 rounded-xl border bg-fd-secondary p-2 focus-within:ring-2 focus-within:ring-fd-ring">
              <label htmlFor="docs-ai-input" className="sr-only">Ask about this documentation page</label>
              <textarea
                id="docs-ai-input"
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder={isReady ? 'Ask about this page…' : 'Model is getting ready…'}
                className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-fd-muted-foreground"
                disabled={!pageContext || status === 'error'}
              />
              <button
                type="submit"
                aria-label="Send message"
                className={cn(buttonVariants({ color: 'primary', size: 'icon-sm' }), 'rounded-full')}
                disabled={!input.trim() || generating || status === 'error' || !pageContext}
              >
                {generating ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <ArrowUp aria-hidden="true" />}
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-fd-muted-foreground">Local AI can make mistakes. Verify important details.</p>
          </form>
        </aside>
      </div>

      {!open ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            buttonVariants({ color: 'primary' }),
            'fixed bottom-5 end-5 z-40 gap-2 rounded-full px-4 py-2.5 shadow-lg motion-safe:transition-transform motion-safe:hover:-translate-y-0.5',
          )}
          aria-label="Open Ask AI"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Ask AI
        </button>
      ) : null}
    </DocsAIContext.Provider>
  );
}

export function DocsAIPageContext({ markdown, title, url }: PageContext) {
  const context = useContext(DocsAIContext);
  useEffect(
    () => context?.setPageContext({ markdown, title, url }),
    [context, markdown, title, url],
  );
  return null;
}
