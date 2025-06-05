'use client';

import { useEffect, useRef, useState } from 'react';

interface LogEntry {
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: Date;
}

export const Console: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom when new logs are added
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const getLogStyle = (type: LogEntry['type']) => {
        switch (type) {
            case 'error':
                return 'text-red-400';
            case 'warning':
                return 'text-yellow-400';
            default:
                return 'text-blue-400';
        }
    };

    return (
        <div className="font-mono text-sm">
            {logs.map((log, index) => (
                <div key={index} className={`${getLogStyle(log.type)} mb-1`}>
                    <span className="text-gray-500">
                        [{log.timestamp.toLocaleTimeString()}]
                    </span>{' '}
                    {log.message}
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
};

export default Console;