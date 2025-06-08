import { cn } from "../lib/utils";

interface MessageProps {
  content: string;
  isUser: boolean;
}

const Message = ({ content, isUser }: MessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 p-4",
        isUser ? "bg-muted/50" : "bg-background"
      )}
    >
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        {isUser ? "👤" : "🤖"}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden px-1">
        <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};

export default Message;
