document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("table");
  const myButton = document.getElementById("calculate");
  const amountField = document.getElementById("amount");
  const output = document.getElementById("output");
  const page = document.getElementById("dropdownMenu");
  const targetLug = document.getElementById("targetLug");

  console.log(targetLug.value);

  const sizeruns = {
    International: ["XS", "S", "M", "L", "XL"],
    Pants: ["26", "28", "30", "32", "34", "36"],
    German: ["44", "46", "48", "50", "52", "54"],
    Japanese: ["1", "2", "3"]
  }

  Object.keys(sizeruns).forEach((value) => {
    const sizerun = document.createElement("option");
    sizerun.value = value;
    sizerun.text = value;

    page.appendChild(sizerun);
  });

  myButton.addEventListener("click", () => {
    const sold = [];
    const lug = [];
    const amount = parseInt(amountField.value);

    const tab = table.rows[1];

    for (var i = 1; i < table.rows[1].cells.length; i++) {
      sold.push(
        parseInt(
          table.rows[1].cells[i].querySelector('input[type="text"]').value
        )
      );

      lug.push(
        parseFloat(
          table.rows[2].cells[i].querySelector('input[type="text"]').value
        )
      );
    }

    const sum = sold.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    const percentual = sold.map((x) => (x / sum) * 100);

    const effective = percentual.map((x) => Math.round((x * amount) / 100));
    const final = effective.map((value, index) =>
      Math.round((value * lug[index]) / targetLug.value)
    );

    const finalSum = final.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    const result = final.map((value) =>
      Math.round((value * amount) / finalSum)
    );

    for (var i = 1; i < table.rows[1].cells.length; i++) {
      output.rows[0].cells[i].querySelector('input[type="text"]').value =
        result[i - 1];
    }
  });

  page.addEventListener("change", (event) => {
    const selectedPage = event.target.value;
    const sizerun = sizeruns[selectedPage];
    adaptTable(sizerun);
  });

  function addColumn(columnName) {
    // Add header cell
    const headerRow = table.querySelector("thead tr");
    const newHeaderCell = document.createElement("th");
    newHeaderCell.textContent = columnName;
    headerRow.appendChild(newHeaderCell);

    // Add cells to existing rows in the tbody
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const newCell = row.insertCell(-1);
      newCell.innerHTML = '<input type="text" class="custom-tf" />';
      // You can add content or additional customization to the new cell here
    });

    // Add cells to existing rows in the tbody
    const outputRows = output.querySelectorAll("tbody tr");
    outputRows.forEach((row) => {
      const newCell = row.insertCell(-1);
      newCell.innerHTML = '<input type="text" class="custom-tf" />';
      // You can add content or additional customization to the new cell here
    });
  }

  function removeColumn(table, columnIndex) {
    const rows = table.querySelectorAll("tr");

    // Remove column
    rows.forEach((row) => {
      const headerCell = row.children[columnIndex];
      if (headerCell) {
        row.removeChild(headerCell);
      }
    });
  }

  function adaptTable(sizerun) {
    let headerRow = table.querySelector("thead tr").children.length;

    for (i = 1; i < headerRow; headerRow--) {
      removeColumn(table, i);
      removeColumn(output, i);
    }

    sizerun.forEach((size) => {
      addColumn(size);
    });
  }

  window.api.receive("adjust-sizerun", (sizerun) => {
    adaptTable(sizerun);
  });
});
