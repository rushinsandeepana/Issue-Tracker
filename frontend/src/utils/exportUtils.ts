import type { Issue } from '../types';

export const exportToCSV = (issues: Issue[], filename: string = 'issues_export') => {
  const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Severity', 'Created At', 'Updated At'];
  
  const rows = issues.map(issue => [
    issue.id,
    `"${issue.title.replace(/"/g, '""')}"`,
    `"${(issue.description || '').replace(/"/g, '""')}"`,
    issue.status,
    issue.priority,
    issue.severity,
    new Date(issue.created_at).toLocaleString(),
    new Date(issue.updated_at).toLocaleString()
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (issues: Issue[], filename: string = 'issues_export') => {
  const exportData = {
    exportedAt: new Date().toISOString(),
    totalIssues: issues.length,
    issues: issues.map(issue => ({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      severity: issue.severity,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at
    }))
  };
  
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (issues: Issue[], format: 'json' | 'text' = 'json') => {
  // eslint-disable-next-line no-useless-assignment
  let textToCopy = '';
  
  if (format === 'json') {
    textToCopy = JSON.stringify(issues, null, 2);
  } else {
    textToCopy = issues.map(issue => 
      `[#${issue.id}] ${issue.title}\nStatus: ${issue.status}\nPriority: ${issue.priority}\nCreated: ${new Date(issue.created_at).toLocaleDateString()}\n---`
    ).join('\n');
  }
  
  try {
    await navigator.clipboard.writeText(textToCopy);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};