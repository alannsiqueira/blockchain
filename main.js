const SHA256 = require("crypto-js/sha256");


class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        console.log(`Houve uma transferência de ${fromAddress ? fromAddress : '#SISTEMA#'} para ${toAddress} no valor de ${amount}`)
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
            // console.log(`${this.hash.substring(0, difficulty)} !== ${Array(difficulty + 1).join("0")}`)
        }

        console.log(`Bloco minerado: ${this.hash}\n`);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.parse("2018-01-25"), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

getBalance = (address) => {
    return console.log(`Saldo do ${address} é: ${coin.getBalanceOfAddress(address)}`);
}

let coin = new Blockchain();
console.log('Inicio das transações\n')
debugger
coin.createTransaction(new Transaction('endereco-1', 'endereco-2', 100));
coin.createTransaction(new Transaction('endereco-2', 'endereco-1', 50));
debugger
console.log('\nComeçou a minerar\n')
coin.minePendingTransactions('minerador-1');
debugger
getBalance('minerador-1')
getBalance('endereco-1')
getBalance('endereco-2')
debugger
console.log('\nMais transações...\n')
coin.createTransaction(new Transaction('minerador-2', 'endereco-1', 50));
coin.createTransaction(new Transaction('minerador-1', 'minerador-2', 100));
debugger
console.log('\nMinerando denovo\n')
coin.minePendingTransactions('minerador-2');
debugger
getBalance('minerador-1')
getBalance('minerador-2')
getBalance('endereco-1')
getBalance('endereco-2')

console.log('Saldo do minerador-2 ainda não foi atualizado, e sera atualizado somente na escriva do próximo bloco.')
debugger
