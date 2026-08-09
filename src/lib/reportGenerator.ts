'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { ProjectSummary, CostEntry, BudgetCategory, Vendor, ChangeOrder } from '@/types';

// ─── Helpers ───────────────────────────────────────────────────
function fmtCurrency(amount: number): string {
  return `ETB ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ─── PDF: Project Cost Report ──────────────────────────────────
export async function generateProjectPDF(
  summary: ProjectSummary,
  costs: CostEntry[],
  categories: BudgetCategory[],
  vendors: Vendor[],
  changeOrders: ChangeOrder[],
  lang: 'en' | 'am' = 'en'
) {
  // Dynamic import html2canvas to ensure client-side execution
  const html2canvas = (await import('html2canvas')).default;

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const vendorMap = Object.fromEntries(vendors.map((v) => [v.id, v.name]));

  // Build a clean, styled HTML report container for rendering
  const reportContainer = document.createElement('div');
  reportContainer.style.position = 'absolute';
  reportContainer.style.left = '-9999px';
  reportContainer.style.top = '-9999px';
  reportContainer.style.width = '840px';
  reportContainer.style.padding = '40px';
  reportContainer.style.backgroundColor = '#ffffff';
  reportContainer.style.color = '#0f172a';
  reportContainer.style.fontFamily = "'Noto Sans Ethiopic', 'Abyssinica SIL', 'Nyala', 'Ebrima', 'Roboto', system-ui, sans-serif";
  reportContainer.style.fontSize = '12px';
  reportContainer.style.lineHeight = '1.5';

  const isAm = lang === 'am';

  reportContainer.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;600;700;800&family=Roboto:wght@400;500;700&display=swap');
      * {
        font-family: 'Noto Sans Ethiopic', 'Abyssinica SIL', 'Nyala', 'Ebrima', 'Roboto', system-ui, sans-serif !important;
      }
    </style>

    <!-- Header -->
    <div style="border-bottom: 3px solid #d4fc34; padding-bottom: 18px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">${summary.project.name}</h1>
        <p style="font-size: 13px; color: #64748b; margin: 0;">${isAm ? 'የግንባታ ወጪ ማጠቃለያ ሪፖርት' : 'Construction Cost Summary Report'}</p>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; background: #0f172a; color: #d4fc34; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; text-transform: uppercase;">
          ${isAm ? 'ወጪ ሪፖርት' : 'COST REPORT'}
        </span>
        <p style="font-size: 11px; color: #64748b; margin: 6px 0 0 0;">${fmtDate(new Date().toISOString())}</p>
      </div>
    </div>

    <!-- Project Info Grid -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
        <div>
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">${isAm ? 'ደንበኛ' : 'CLIENT'}</span>
          <p style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 2px 0 0 0;">${summary.project.clientName || '-'}</p>
        </div>
        <div>
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">${isAm ? 'ቦታ' : 'LOCATION'}</span>
          <p style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 2px 0 0 0;">${summary.project.address || '-'}</p>
        </div>
        <div>
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">${isAm ? 'ሁኔታ' : 'STATUS'}</span>
          <p style="font-size: 13px; font-weight: 700; color: #4f46e5; margin: 2px 0 0 0;">${summary.project.status.toUpperCase()}</p>
        </div>
        <div>
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">${isAm ? 'ጠቅላላ ወጪ' : 'TOTAL SPENT'}</span>
          <p style="font-size: 14px; font-weight: 800; color: #059669; margin: 2px 0 0 0;">${fmtCurrency(summary.totalSpent)}</p>
        </div>
      </div>
    </div>

    <!-- Budget Summary Section -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em;">
        ${isAm ? 'የበጀት ምድቦች ማጠቃለያ' : 'Budget Categories Summary'}
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <thead>
          <tr style="background: #0f172a; color: #ffffff;">
            <th style="padding: 10px; text-align: left; border-radius: 6px 0 0 0;">${isAm ? 'ምድብ' : 'Category'}</th>
            <th style="padding: 10px; text-align: left;">${isAm ? 'ኮድ' : 'Code'}</th>
            <th style="padding: 10px; text-align: right;">${isAm ? 'የተመደበ በጀት' : 'Budgeted'}</th>
            <th style="padding: 10px; text-align: right;">${isAm ? 'ትክክለኛ ወጪ' : 'Actual Spent'}</th>
            <th style="padding: 10px; text-align: right;">${isAm ? 'ልዩነት' : 'Variance'}</th>
            <th style="padding: 10px; text-align: right; border-radius: 0 6px 0 0;">% ${isAm ? 'ጥቅም ላይ' : 'Used'}</th>
          </tr>
        </thead>
        <tbody>
          ${summary.categories.map((cat, idx) => `
            <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: 700; color: #0f172a;">${cat.category.name}</td>
              <td style="padding: 10px; color: #64748b;">${cat.category.code}</td>
              <td style="padding: 10px; text-align: right; color: #475569;">${fmtCurrency(cat.category.budgetedAmount)}</td>
              <td style="padding: 10px; text-align: right; font-weight: 700; color: #0f172a;">${fmtCurrency(cat.actualSpent)}</td>
              <td style="padding: 10px; text-align: right; font-weight: 700; color: ${cat.variance >= 0 ? '#059669' : '#dc2626'};">
                ${cat.variance >= 0 ? '+' : ''}${fmtCurrency(cat.variance)}
              </td>
              <td style="padding: 10px; text-align: right; font-weight: 700; color: ${cat.percentUsed >= 100 ? '#dc2626' : '#059669'};">
                ${cat.percentUsed}%
              </td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="background: #f1f5f9; font-weight: 800; border-top: 2px solid #cbd5e1;">
            <td style="padding: 10px; color: #0f172a;">${isAm ? 'ጠቅላላ' : 'TOTAL'}</td>
            <td style="padding: 10px;">-</td>
            <td style="padding: 10px; text-align: right; color: #0f172a;">${fmtCurrency(summary.totalBudget)}</td>
            <td style="padding: 10px; text-align: right; color: #0f172a;">${fmtCurrency(summary.totalSpent)}</td>
            <td style="padding: 10px; text-align: right; color: ${summary.totalRemaining >= 0 ? '#059669' : '#dc2626'};">
              ${summary.totalRemaining >= 0 ? '+' : ''}${fmtCurrency(summary.totalRemaining)}
            </td>
            <td style="padding: 10px; text-align: right; color: ${summary.percentUsed >= 100 ? '#dc2626' : '#059669'};">
              ${summary.percentUsed}%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Cost Entries Section -->
    ${costs.length > 0 ? `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em;">
          ${isAm ? 'የወጪ ግቤቶች' : 'Cost Entries'} (${costs.length})
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background: #1e293b; color: #ffffff;">
              <th style="padding: 8px; text-align: left;">${isAm ? 'ቀን' : 'Date'}</th>
              <th style="padding: 8px; text-align: left;">${isAm ? 'ማብራሪያ' : 'Description'}</th>
              <th style="padding: 8px; text-align: left;">${isAm ? 'ምድብ' : 'Category'}</th>
              <th style="padding: 8px; text-align: left;">${isAm ? 'አቅራቢ' : 'Vendor'}</th>
              <th style="padding: 8px; text-align: right;">${isAm ? 'መጠን' : 'Amount'}</th>
              <th style="padding: 8px; text-align: center;">${isAm ? 'ሁኔታ' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            ${costs.map((cost, idx) => `
              <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px; color: #64748b; white-space: nowrap;">${fmtDate(cost.entryDate)}</td>
                <td style="padding: 8px; font-weight: 700; color: #0f172a;">${cost.description}</td>
                <td style="padding: 8px; color: #475569;">${catMap[cost.categoryId] || '-'}</td>
                <td style="padding: 8px; color: #475569;">${cost.vendorId ? (vendorMap[cost.vendorId] || '-') : '-'}</td>
                <td style="padding: 8px; text-align: right; font-weight: 700; color: #0f172a;">${fmtCurrency(cost.amount)}</td>
                <td style="padding: 8px; text-align: center; font-weight: 700; color: #059669;">${cost.paymentStatus.toUpperCase()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    <!-- Footer -->
    <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 30px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
      <span>CostTracker — ${isAm ? 'የግንባታ ወጪ መከታተያ' : 'Construction Cost Tracker'}</span>
      <span>${isAm ? 'ገጽ 1' : 'Page 1'}</span>
    </div>
  `;

  document.body.appendChild(reportContainer);

  try {
    const canvas = await html2canvas(reportContainer, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${summary.project.name.replace(/\s+/g, '_')}_Report.pdf`);
  } catch (err) {
    console.error('Canvas PDF render error, falling back to standard jsPDF:', err);
    // Fallback standard export
    const fallbackDoc = new jsPDF();
    autoTable(fallbackDoc, {
      head: [['Project', 'Spent', 'Budget']],
      body: [[summary.project.name, fmtCurrency(summary.totalSpent), fmtCurrency(summary.totalBudget)]],
    });
    fallbackDoc.save(`${summary.project.name}_Report.pdf`);
  } finally {
    document.body.removeChild(reportContainer);
  }
}

// ─── Excel: Project Cost Report (UTF-8 Native) ─────────────────
export function generateProjectExcel(
  summary: ProjectSummary,
  costs: CostEntry[],
  categories: BudgetCategory[],
  vendors: Vendor[],
  changeOrders: ChangeOrder[],
  lang: 'en' | 'am' = 'en'
) {
  const wb = XLSX.utils.book_new();
  const isAm = lang === 'am';
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const vendorMap = Object.fromEntries(vendors.map((v) => [v.id, v.name]));

  // ── Sheet 1: Summary ──
  const summaryData = [
    [isAm ? 'የግንባታ ወጪ ሪፖርት' : 'Construction Cost Report'],
    [],
    [isAm ? 'ፕሮጀክት' : 'Project', summary.project.name],
    [isAm ? 'ደንበኛ' : 'Client', summary.project.clientName],
    [isAm ? 'ቦታ' : 'Location', summary.project.address],
    [isAm ? 'ሁኔታ' : 'Status', summary.project.status],
    [isAm ? 'የጀመሩበት ቀን' : 'Start Date', fmtDate(summary.project.startDate)],
    [isAm ? 'የመጨረሻ ቀን' : 'End Date', fmtDate(summary.project.endDate)],
    [],
    [isAm ? 'ጠቅላላ የተመደበ በጀት' : 'Total Budget (ETB)', summary.totalBudget],
    [isAm ? 'ጠቅላላ ወጪ' : 'Total Spent (ETB)', summary.totalSpent],
    [isAm ? 'ቀሪ' : 'Remaining (ETB)', summary.totalRemaining],
    ['% ' + (isAm ? 'ጥቅም ላይ' : 'Used'), summary.percentUsed],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 28 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, isAm ? 'ማጠቃለያ' : 'Summary');

  // ── Sheet 2: Budget Categories ──
  const catHeaders = [
    isAm ? 'ምድብ' : 'Category',
    isAm ? 'ኮድ' : 'Code',
    isAm ? 'የተመደበ (ETB)' : 'Budgeted (ETB)',
    isAm ? 'ትክክለኛ ወጪ (ETB)' : 'Actual Spent (ETB)',
    isAm ? 'ልዩነት (ETB)' : 'Variance (ETB)',
    '% ' + (isAm ? 'ጥቅም ላይ' : 'Used'),
  ];
  const catRows = summary.categories.map((cat) => [
    cat.category.name,
    cat.category.code,
    cat.category.budgetedAmount,
    cat.actualSpent,
    cat.variance,
    cat.percentUsed,
  ]);
  catRows.push([
    isAm ? 'ጠቅላላ' : 'TOTAL',
    '',
    summary.totalBudget,
    summary.totalSpent,
    summary.totalRemaining,
    summary.percentUsed,
  ]);

  const wsCat = XLSX.utils.aoa_to_sheet([catHeaders, ...catRows]);
  wsCat['!cols'] = [{ wch: 28 }, { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsCat, isAm ? 'የበጀት ምድቦች' : 'Categories');

  // ── Sheet 3: Cost Entries ──
  const costHeaders = [
    isAm ? 'ቀን' : 'Date',
    isAm ? 'ማብራሪያ' : 'Description',
    isAm ? 'ምድብ' : 'Category',
    isAm ? 'አቅራቢ' : 'Vendor',
    isAm ? 'መጠን (ETB)' : 'Amount (ETB)',
    isAm ? 'ዓይነት' : 'Type',
    isAm ? 'የክፍያ ሁኔታ' : 'Payment Status',
  ];
  const costRows = costs.map((cost) => [
    fmtDate(cost.entryDate),
    cost.description,
    catMap[cost.categoryId] || '',
    cost.vendorId ? (vendorMap[cost.vendorId] || '') : '',
    cost.amount,
    cost.entryType,
    cost.paymentStatus,
  ]);

  const wsCosts = XLSX.utils.aoa_to_sheet([costHeaders, ...costRows]);
  wsCosts['!cols'] = [
    { wch: 14 }, { wch: 38 }, { wch: 22 }, { wch: 22 }, { wch: 18 }, { wch: 14 }, { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, wsCosts, isAm ? 'ወጪዎች' : 'Costs');

  // ── Sheet 4: Vendors ──
  if (vendors.length > 0) {
    const vendorHeaders = [
      isAm ? 'ስም' : 'Name',
      isAm ? 'ግንኙነት' : 'Contact',
      isAm ? 'ስልክ' : 'Phone',
      isAm ? 'ኢሜይል' : 'Email',
      isAm ? 'ሙያ' : 'Trade',
    ];
    const vendorRows = vendors.map((v) => [
      v.name, v.contactName, v.phone, v.email || '', v.trade,
    ]);
    const wsVendors = XLSX.utils.aoa_to_sheet([vendorHeaders, ...vendorRows]);
    wsVendors['!cols'] = [{ wch: 25 }, { wch: 22 }, { wch: 18 }, { wch: 28 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsVendors, isAm ? 'አቅራቢዎች' : 'Vendors');
  }

  // ── Sheet 5: Change Orders ──
  if (changeOrders.length > 0) {
    const coHeaders = [
      isAm ? 'ቀን' : 'Date',
      isAm ? 'ማብራሪያ' : 'Description',
      isAm ? 'መጠን (ETB)' : 'Amount (ETB)',
      isAm ? 'ሁኔታ' : 'Status',
    ];
    const coRows = changeOrders.map((co) => [
      fmtDate(co.requestedDate),
      co.description,
      co.amount,
      co.status,
    ]);
    const wsCO = XLSX.utils.aoa_to_sheet([coHeaders, ...coRows]);
    wsCO['!cols'] = [{ wch: 14 }, { wch: 45 }, { wch: 20 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsCO, isAm ? 'የለውጥ ትዕዛዞች' : 'Change Orders');
  }

  XLSX.writeFile(wb, `${summary.project.name.replace(/\s+/g, '_')}_Report.xlsx`);
}
