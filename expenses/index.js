/*
CMPS3141-HCI - AS3-23S1
Collaborators:
Date: Sept.22.23
*/

import { createApp } from "https://mavue.mavo.io/mavue.js";

globalThis.app = createApp({
	data: {
		expenses: [],
		personA: "Neo",
		personB: "Trinity",
		joint: "Joint",
		totalPersonAOwes: 0,
		totalPersonBOwes: 0,
		nowDate: new Date().toISOString().slice(0,10),
		errors: "",
		showConfirmationDialog: false,
		expenseToAdd: null,
		
		form: {
			payer: "",
			payingTo: "",
			amount: 0,
			description: "",
			pDate: "",
			currency: "BZD"
		}
	},

	methods: {
		/**
		 * Currency convert function stub.
		 * In a real app, you would use an API to get the latest exchange rates,
		 * and we'd need to support all currency codes, not just MXN, BZD and GTQ.
		 * However, for the purposes of this assignment lets just assume they travel near by so this is fine.
		 * @param {"MXN" | "BZD" | "GTQ"} from - Currency code to convert from
		 * @param {"MXN" | "BZD" | "GTQ"} to - Currency code to convert to
		 * @param {number} amount - Amount to convert
		 * @returns {number} Converted amount
		 */
		currencyConvert(from, to, amount) {
			const rates = {
				BZD: 1,
				MXN: 8.73,
				GTQ: 3.91
			};

			return amount * rates[to] / rates[from];
		},

		addExpense() {
			// Check if any required fields are missing
			if (!this.form.payer || !this.form.payingTo || !this.form.amount || !this.form.pDate) {
			  this.errors = "*Please fill out missing fields";
			  return; // Exit the method if any required fields are missing
			}
		  
			// Create an expense object from the form data
			const expense = {
			  pDate: this.formatDate(this.form.pDate),
			  payer: this.form.payer,
			  payingTo: this.form.payingTo,
			  currency: this.form.currency,
			  formAmount: this.form.amount,
			  description: this.form.description,
			  personAOwes: 0, // Initialize to 0
			  personBOwes: 0, // Initialize to 0
			};
		  
			// Add the expense to the expenses array
			this.expenses.push(expense);
		  
			// Update the total amounts owed for each person
			if (expense.payer === this.personA) {
			  // Neo paid, update Trinity's owes
			  if (expense.payingTo === this.personB) {
				expense.personBOwes = this.currencyConvert(
				  expense.currency,
				  "BZD",
				  expense.formAmount
				);
				this.totalPersonAOwes += expense.personBOwes;
			  }
			} else if (expense.payer === this.personB) {
			  // Trinity paid, update Neo's owes
			  if (expense.payingTo === this.personA) {
				expense.personAOwes = this.currencyConvert(
				  expense.currency,
				  "BZD",
				  expense.formAmount
				);
				this.totalPersonBOwes += expense.personAOwes;
			  }
			} else if (expense.payer === this.joint) {
			  // Joint expense, update both persons' owes
			  if (expense.payingTo === this.personA) {
				const amount = this.currencyConvert(
				  expense.currency,
				  "BZD",
				  expense.formAmount / 2
				);
				expense.personAOwes = amount;
				expense.personBOwes = amount;
				this.totalPersonAOwes += amount;
				this.totalPersonBOwes += amount;
			  } else if (expense.payingTo === this.personB) {
				const amount = this.currencyConvert(
				  expense.currency,
				  "BZD",
				  expense.formAmount / 2
				);
				expense.personAOwes = amount;
				expense.personBOwes = amount;
				this.totalPersonAOwes += amount;
				this.totalPersonBOwes += amount;
			  }
			}
		  
			// Clear the form fields
			this.form.payer = "";
			this.form.payingTo = "";
			this.form.amount = 0;
			this.form.description = "";
			this.form.pDate = "";
		  
			// Reset errors
			this.errors = "";
		  },
		  
		  formatDate(dateString) {
			// Check if the input date string is in "yyyy-mm-dd" format
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
			if (!dateRegex.test(dateString)) {
			  // Invalid date format, return an empty string or handle it as needed
			  return "";
			}
		  
			// Create a Date object in the local time zone
			const date = new Date(dateString);
		  
			// Add one day to the date to account for the offset
			date.setDate(date.getDate() + 1);
		  
			const day = date.getDate().toString().padStart(2, '0');
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const year = date.getFullYear();
			return `${day}/${month}/${year}`;
		  },


	},


	computed: {
		total_balance() {
		  let totalPersonAOwes = 0;
		  let totalPersonBOwes = 0;
	  
		  for (let expense of this.expenses) {
			totalPersonAOwes += expense.personAOwes;
			totalPersonBOwes += expense.personBOwes;
		  }
	  
		  return {
			totalPersonAOwes,
			totalPersonBOwes
		  };
		}
	  }
	  
}, "#app");
