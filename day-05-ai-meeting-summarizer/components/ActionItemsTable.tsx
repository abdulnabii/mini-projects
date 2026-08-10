import { ActionItem } from "@/types";
import { cn } from "@/lib/utils";

export default function ActionItemsTable({ items }: { items: ActionItem[] }) {
  if (!items.length) return <p className="text-slate-500 text-sm">No action items detected.</p>;

  return (
    <table className="w-full text-left text-sm whitespace-nowrap">
      <thead>
        <tr className="border-b border-purple-500/10 text-slate-400">
          <th className="py-3 px-4 font-medium">Task</th>
          <th className="py-3 px-4 font-medium">Assignee</th>
          <th className="py-3 px-4 font-medium">Deadline</th>
          <th className="py-3 px-4 font-medium">Priority</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-purple-500/10">
        {items.map((item, i) => (
          <tr key={item.id || i} className="text-slate-300">
            <td className="py-3 px-4 whitespace-normal">{item.task}</td>
            <td className="py-3 px-4">{item.assignee || 'Unassigned'}</td>
            <td className="py-3 px-4 text-slate-500">{item.deadline || '-'}</td>
            <td className="py-3 px-4">
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                item.priority === 'HIGH' ? "bg-red-500/10 text-red-400" :
                item.priority === 'MEDIUM' ? "bg-amber-500/10 text-amber-400" :
                "bg-emerald-500/10 text-emerald-400"
              )}>
                {item.priority}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
