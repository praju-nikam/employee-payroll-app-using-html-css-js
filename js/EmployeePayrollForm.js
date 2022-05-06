let isUpdate = false;
let employeePayrollObj = {};
window.addEventListener("DOMContentLoaded", () => {

    const name = document.querySelector("#name");
    const nameError = document.querySelector(".name-error");
    const validName = document.querySelector(".valid-name");
    if (name) {
        name.addEventListener("input", function() {
            if (name.value.length == 0) {
                nameError.textContent = "";
                validName.textContent = "";
            } else {
                try {
                    (new EmployeePayrollData).name = name.value;
                    nameError.textContent = "";
                    validName.textContent = '✓';
                    document.querySelector(".submitButton").disabled = false;
                } catch (error) {
                    nameError.textContent = error;
                    validName.textContent = "";
                    document.querySelector(".submitButton").disabled = true;
                }
            }
        });
    }


    const startDate = document.querySelector("#startDate");
    const startDateError = document.querySelector(".startDate-error");
    const validStartDate = document.querySelector(".valid-startDate");
    if (startDate) {
        startDate.addEventListener("input", function() {
            try {
                let dateString = document.querySelector("#month").value + " " + document.querySelector("#day").value + ", " + document.querySelector("#year").value;
                (new EmployeePayrollData).startDate = new Date(dateString);
                startDateError.textContent = "";
                validStartDate.textContent = '✓';
                document.querySelector(".submitButton").disabled = false;
            } catch (error) {
                startDateError.textContent = error;
                validStartDate.textContent = "";
                document.querySelector(".submitButton").disabled = true;
            }
        });
    }

    const salary = document.querySelector("#salary");
    const output = document.querySelector(".salary-output");
    if (salary) {
        salary.oninput = function() {
            output.textContent = salary.value;
        };
        checkForUpdate();
    }
});

const save = () => {
    try {
        let employeePayrollData = createEmployeePayrollObject();
        if (employeePayrollData != undefined) updateLocalStorage(employeePayrollData);
    } catch (submitError) {
        alert(submitError);
        return;
    }
};

const createEmployeePayrollObject = () => {
    let employeePayrollData = new EmployeePayrollData();

    employeePayrollData.name = getValue("#name");
    employeePayrollData.gender = getSelectedValues("[name=gender]").pop();
    employeePayrollData.profilePicture = getSelectedValues("[name=profile]").pop();
    employeePayrollData.salary = getValue("#salary");
    dateString = document.querySelector("#month").value + " " + document.querySelector("#day").value + ", " + document.querySelector("#year").value;
    employeePayrollData.startDate = new Date(dateString);
    employeePayrollData.note = getValue("#notes");
    try {
        employeePayrollData.departments = getSelectedValues("[name=department]");
    } catch (error) {
        alert(error);
        return;
    }
    employeePayrollData.id = createEmployeeId();
    alert("Employee Added Successfully!\n" + employeePayrollData.toString());
    return employeePayrollData;
};

const getSelectedValues = (propertyName) => {
    let allValues = document.querySelectorAll(propertyName);
    let selectedValues = [];
    allValues.forEach(input => {
        if (input.checked) selectedValues.push(input.value);
    });
    return selectedValues;
};

const getValue = (propertyId) => {
    let value = document.querySelector(propertyId).value;
    return value;
};

function updateLocalStorage(employeePayrollData) {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList != undefined) {
        employeePayrollList.push(employeePayrollData);
    } else {
        employeePayrollList = [employeePayrollData];
    }
    alert("Local Storage Updated Successfully!\nTotal Employees : " + employeePayrollList.length);
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

const createEmployeeId = () => {
    let employeeId = localStorage.getItem("EmployeeID");
    employeeId = !employeeId ? 1 : (parseInt(employeeId) + 1).toString();
    localStorage.setItem("EmployeeID", employeeId);
    return employeeId;
};

const resetForm = () => {
    setDefaultValue("#name", "");
    setDefautlText(".name-error");
    setDefautlText(".valid-name");
    unsetSelectedValues("[name=profile]");
    unsetSelectedValues("[name=gender]");
    unsetSelectedValues("[name=department]");
    resetRange("#salary", ".salary-output");
    setDefaultValue("#day", "1");
    setDefaultValue("#month", "January");
    setDefaultValue("#year", "2020");
    setDefautlText(".startDate-error");
    setDefautlText(".valid-startDate");
    setDefaultValue("#notes", "");
};

const setDefaultValue = (propertyId, value) => {
    const element = document.querySelector(propertyId);
    element.value = value;
};

const unsetSelectedValues = (propertyName) => {
    allValues = document.querySelectorAll(propertyName);
    allValues.forEach(input => input.checked == false);
};

const resetRange = (propertyId, outputId) => {
    const rangeElement = document.querySelector(propertyId);
    rangeElement.value = 400000;
    const outputElement = document.querySelector(outputId);
    outputElement.textContent = rangeElement.value;
};

const setDefautlText = (propertyId) => {
    const contentElement = document.querySelector(propertyId);
    contentElement.textContent = "";
};
const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}