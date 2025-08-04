import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface SOAPNoteProps {
  content: string;
  className?: string;
}

export function SOAPNote({ content, className }: SOAPNoteProps) {
  return (
    <div className={cn("soap-note", className)}>
      <ReactMarkdown
        className="prose prose-slate max-w-none"
        components={{
          // Enhanced heading styling for SOAP sections
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 pb-2 border-b-2 border-blue-200 dark:border-blue-700 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              {children}
            </h3>
          ),
          // Enhanced paragraph styling with better spacing
          p: ({ children }) => (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-base">
              {children}
            </p>
          ),
          // Enhanced list styling for medical bullet points
          ul: ({ children }) => (
            <ul className="space-y-2 mb-6 ml-4">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3 mt-1 text-sm">•</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          // Enhanced strong/bold text for medical emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-gray-100">
              {children}
            </strong>
          ),
          // Enhanced em/italic for medical terminology
          em: ({ children }) => (
            <em className="italic text-gray-800 dark:text-gray-200">
              {children}
            </em>
          ),
          // Code blocks for measurements/values
          code: ({ children }) => (
            <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 