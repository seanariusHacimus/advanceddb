import XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { indicatorStatus } from '../constants';

export const exportToExel = ({ title = 'report', exportType = 'xlsx', data = [] }) => {
  // const { token, user_id: userId } = rocketAuth;
  const fileName = `${title.toLowerCase().replace(/\s/g, '-')}-${moment().format('YYYY-MM-DD')}`;

  let jsonToXls = XLSX.utils.json_to_sheet(converActionsIntoPrintData(data));
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, jsonToXls, fileName);
  XLSX.writeFile(wb, fileName + '.' + exportType);
}

export const exportToPdf = ({ title = 'report', data = [] }) => {
  const fileName = `${title.toLowerCase().replace(/\s/g, '-')}-${moment().format('YYYY-MM-DD')}`;
  const pdf = new jsPDF({
    orientation: 'landscape',
    format: 'A4'
  });

  const column = ["#", "Name", "Start at", "End at", "Status", 'Responsible']
  pdf.autoTable({
    theme: 'grid',
    head: [column],
    headStyles: { fillColor: '#527BDD' },
    body: converActionsIntoPrintData(data).map(item => Object.values(item)),
    willDrawCell: (data) => {
      if (data.section === 'body' && data.column.dataKey === 4) {
        const status = data.cell.text[0];
        data.cell.text = [indicatorStatus[status]];
      }
    },
  });

  pdf.save(`${fileName}.pdf`);
}


function converActionsIntoPrintData(data) {

  function capitalizeObject(data) {
    let obj = {};
    const allowedFields = ['name', 'start_at', 'end_at', 'status'];
    for (let key in data) {
      if (allowedFields.includes(key)) {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        const value = ['start_at', 'end_at'].includes(key) ? new Date(data[key]).toLocaleDateString() : data[key];
        obj = { ...obj, [name]: value ?? '' };
      }
    }
    return obj;
  }

  function creatArrayOfStr(arr) {
    const data = arr.map(item => {
      if ('title' in item) {
        return item.title;
      }
      return `${item.first_name} ${item.last_name}`;
    });
    return data.join(', ');
  }

  let result = [];

  data.forEach((item, index) => {
    const { sub_actions, responsive_accounts, responsive_tags, ...rest } = item;
    const responsible = creatArrayOfStr([...responsive_accounts, ...responsive_tags]);
    const parentAction = { '#': item.index, ...capitalizeObject(rest), Responsible: responsible };

    result.push(parentAction);
  });
  return result;
}



export function printAllActionsPdf({ dataObject = {} }) {
  const data = Object.entries(dataObject);
  var pdf = new jsPDF({
    orientation: 'landscape',
    format: 'A4',
  });

  const column = ["#", "Name", "Start at", "End at", "Status", 'Responsible'];

  for (var i = 0; i < data.length; i++) {
    const [title, item] = data[i];
    pdf.autoTable({
      theme: 'grid',
      head: [column],
      // start: 30,
      headStyles: { fillColor: '#527BDD' },
      body: converActionsIntoPrintData(item).map(item => Object.values(item)),
      willDrawCell: (data) => {
        if (data.section === 'body' && data.column.dataKey === 4) {
          const status = data.cell.text[0];
          data.cell.text = [indicatorStatus[status]];
        }
      },
      didDrawPage: function (data) {
        pdf.text(`${title} - ${new Date().toLocaleDateString()}`, 15, 10);
      },

      pageBreak: 'always',
    });
  }

  pdf.deletePage(1)
  return pdf.save(`report.pdf`);
}

export function printAllActionsExcel({ dataObject = {}, exportType = 'xlsx' }) {
  const data = Object.entries(dataObject);

  let wb = XLSX.utils.book_new();
  for (var i = 0; i < data.length; i++) {
    const [title, item] = data[i];
    const fileName = `${title.toLowerCase().replace(/\s/g, '-').slice(0, 29)}`;
    let jsonToXls = XLSX.utils.json_to_sheet(converActionsIntoPrintData(item));

    XLSX.utils.book_append_sheet(wb, jsonToXls, fileName);
  }

  return XLSX.writeFile(wb, `Report-${moment().format('YYYY-MM-DD')}` + '.' + exportType);
}