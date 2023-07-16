const request = require("supertest");

const transactions = require("../app.js");
let transactionsArray = require("../models/transaction.js");

describe("transactions", () => {
  let originalTransactionsArray = transactionsArray;

  beforeEach(() => {
    transactionsArray = originalTransactionsArray;
  });

  describe("/transactions", () => {
    describe("GET", () => {
      it("sends the transactions array", async () => {
        const response = await request(transactions).get("/transactions");

        expect(JSON.parse(response.text)).toEqual(transactionsArray);
      });
    });

    describe("POST", () => {
      it("adds new transaction to end of transactions array", async () => {
        const newLastArrayPosition = transactionsArray.length;
        const newTransaction = {
          id: newLastArrayPosition + 1,
          item_name: "Income",
          amount: 1000,
          date: "2023-07-12",
          from: "Employer",
          category: "Salary",
        };

        await new Promise((resolve) => {
          request(transactions)
            .post(`/transactions`)
            .send(newTransaction)
            .set("Accept", "application/json")
            .expect("headers.location", "/transactions")
            .expect("statusCode", 303)
            .end(resolve);
        });

        expect(transactionsArray[newLastArrayPosition]).toEqual(newTransaction);
      });
    });
  });

  describe("/transactions/:arrayIndex", () => {
    describe("GET", () => {
      it("sends the corresponding transaction when a valid index is given", async () => {
        const response = await request(transactions).get("/transactions/1");

        expect(JSON.parse(response.text)).toEqual(transactionsArray[1]);
      });

      it("sends a 404 status when an invalid index is given", async () => {
        const response = await request(transactions).get("/transactions/9001");

        expect(response.status).toBe(404);
      });
    });

    describe("PUT", () => {
      it("replaces the index in the transactions array", async () => {
        const updatedTransaction = transactionsArray[0];

        await new Promise((resolve) => {
          request(transactions)
            .put("/transactions/0")
            .send(updatedTransaction)
            .set("Accept", "application/json")
            .expect("headers.location", "/transactions/")
            .expect("statusCode", 303)
            .end(resolve);
        });

        expect(transactionsArray[0]).toEqual(updatedTransaction);
      });
    });

    describe("DELETE", () => {
      it("deletes at the index in the transactions array", async () => {
        const transactionToDelete = transactionsArray[2];
        const originalLength = transactionsArray.length;
        await new Promise((resolve) => {
          request(transactions)
            .delete("/transactions/2")
            .set("Accept", "application/json")
            .expect("headers.location", "/transactions")
            .expect("statusCode", 303)
            .end(resolve);
        });

        expect(transactionsArray[2]).toEqual(originalTransactionsArray[2]);
        expect(transactionsArray).toHaveLength(originalLength - 1);
      });
    });
  });
});
