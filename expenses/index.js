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

		addPayment() {
			const payer = this.form.payer;
			const payingTo = this.form.payingTo;
			const description = this.form.description;
			const pDate = this.form.pDate;
			const currency = this.form.currency;
			const formAmount = this.form.amount.toFixed(2);
			let amount = this.form.amount.toFixed(2);
		  
			// Check if any of the required fields are empty or the amount is zero
			if (payer === "" || payingTo === "" || formAmount === "0.00" || description === "" || pDate === "") {
			  this.errors = "* Please fill out all the fields!";
			  return false;
			}
		  
			// Currency conversion (you can customize this part)
			if (currency === "MXN") {
			  amount = (this.currencyConvert("MXN", "BZD", amount)).toFixed(2);
			} else if (currency === "GTQ") {
			  amount = (this.currencyConvert("GTQ", "BZD", amount)).toFixed(2);
			}
		  
			// Confirm before adding the payment
			if (confirm("Are you sure you want to add this payment? If so, click 'OK'")) {
			  // Calculate personAOwes and personBOwes based on payer and payingTo
			  let personAOwes = 0;
			  let personBOwes = 0;
		  
			  if (payer === this.personB && (payingTo === this.personA || payingTo === this.joint)) {
				personAOwes = (amount / 2).toFixed(2);
				personBOwes = (amount / 2).toFixed(2);
			  } else if (payer === this.personA && (payingTo === this.personB || payingTo === this.joint)) {
				personAOwes = (amount / 2).toFixed(2);
				personBOwes = (amount / 2).toFixed(2);
			  } else if (payer === this.joint && (payingTo === this.personA || payingTo === this.personB)) {
				personAOwes = 0;
				personBOwes = 0;
			  }
		  
			  // Update total amounts
			  this.totalPersonAOwes += Number(personAOwes);
			  this.totalPersonBOwes += Number(personBOwes);
		  
			  // Add the payment to expenses array
			  this.expenses.push({
				payer,
				payingTo,
				amount,
				description,
				pDate,
				personAOwes,
				personBOwes,
				currency,
				formAmount
			  });
		  
			  // Reset the form and clear errors
			  this.form = {
				payer: "",
				payingTo: "",
				amount: 0,
				description: "",
				pDate: "",
				currency: "BZD"
			  };
			  this.errors = "";
			} else {
			  return false;
			}
		  }
		  

	},

	computed: {
		total_balance () {
			let total = 0;

			for (let expense of this.expenses) {
				let trinity_paid = expense.trinity_paid ?? 0;
				let neo_paid = expense.neo_paid ?? 0;
				let trinity_paid_for_neo = expense.trinity_paid_for_neo ?? 0;
				let neo_paid_for_trinity = expense.neo_paid_for_trinity ?? 0;

				total += (trinity_paid - neo_paid)/2 + trinity_paid_for_neo - neo_paid_for_trinity;
			}

			return total;
		}
	}
}, "#app");
