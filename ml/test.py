import re

import numpy as np
import psycopg2
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import torch.utils.data as data


class TableDL(data.Dataset):
    def __init__(self, db, table, columns = '*', condition = '', host = 'localhost', user = 'postgres'):
        conn = psycopg2.connect(f'host={host} dbname={db} user={user}')
        cur = conn.cursor()
        cur.execute(f'SELECT {columns} FROM {table} {condition};')
        self.items = cur.fetchall()
        self.len = len(self.items)

    def __getitem__(self, index):
        if isinstance(index, int):
            return self.items[index]
        elif isinstance(index, tuple):
            if isinstance(index[0], int):
                return self.items[index[0]][index[1]]
            elif isinstance(index[0], slice):
                return [item[index[1]] for item in self.items[index[0]]]
        elif isinstance(index, slice):
            return self.items[index]
        else:
            raise Exception(f'Cant get item {index}')

    def __len__(self):
        return self.len

class NameCatDL(data.Dataset):
    def __init__(self):
        self.dl = TableDL('Todo', 'todo_del', 'name, category', 'where category is not null')
        allWords = [word.lower() for name in self.dl[:,0] for word in splitWords(name)]
        self.words = list(map(lambda x: x[0], group(allWords)))
        self.categories = list(map(lambda x: x[0], group(self.dl[:,1])))

        self.num_words = len(self.words)
        self.num_cats = len(self.categories)

        self.word_ix = {}
        for i, word in enumerate(self.words):
            self.word_ix[word] = i
        self.cat_ix = {}
        for i, cat in enumerate(self.categories):
            self.cat_ix[cat] = i

    def __getitem__(self, index):
        items = self.dl[index]
        if isinstance(items, list):
            cat_encs = torch.zeros((0,self.num_cats))
            word_encs = torch.zeros((0,self.num_words))
            for item in items:
                word_enc, cat_enc, _ = self.getEncoding(item)
                cat_encs = torch.cat((cat_encs, cat_enc.reshape(1,self.num_cats)))
                word_encs = torch.cat((word_encs, word_enc.reshape(1,self.num_words)))
            return word_encs, cat_encs, items
        else:
            return self.getEncoding(items)

    def getEncoding(self, item):
        words = [word.lower() for word in splitWords(item[0])]
        cat = item[1].lower()
        cat_enc = self.cat_enc(cat)
        word_enc = self.word_enc(words)
        return word_enc, cat_enc, item

    def word_enc(self, words):
        word_enc = torch.zeros(self.num_words)
        for word in words:
            word_enc = word_enc + oneHot(self.num_words, self.word_ix[word])
        return word_enc

    def cat_enc(self, cat):
        return oneHot(self.num_cats, self.cat_ix[cat])

    def pred_to_cat(self, tensor):
        max_ix = np.argmax(tensor.cpu().detach().numpy())
        return self.categories[max_ix]

    def __len__(self):
        return len(self.dl)

def splitWords(str: str):
    return re.findall('[A-Za-zÄÖÜäöü]+', str)

def group(lst, f = lambda x: x, g = lambda x: x):
    values = set(map(f, lst))
    newlist = [[g(y) for y in lst if f(y)==x] for x in values]
    return newlist

def oneHot(len, ix):
    x = torch.zeros(len)
    x[ix] = 1
    return x

class LogisticRegression(nn.Module):
     def __init__(self, input_size, output_size):
        super(LogisticRegression, self).__init__()
        self.linear = nn.Linear(input_size, output_size)

     def forward(self, x):
        return F.sigmoid(self.linear(x))

testDL = NameCatDL()

inputs, outputs, items = testDL[:]

model = LogisticRegression(testDL.num_words, testDL.num_cats)
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters())

num_its = 2000
cuda = False

if cuda:
    model = model.cuda()

inp, out = inputs, outputs
if cuda:
    inp, out = inp.cuda(), out.cuda()

for i in range(num_its):
    optimizer.zero_grad()

    pred = model(inp)
    loss = criterion(pred, out)
    loss.backward()
    optimizer.step()

    print(f'[{i}/{num_its}] loss: {loss.detach().item()}')

pred = model(inp)
for i in range(len(items)):
    item = items[i]
    max_ix = np.argmax(pred[i].cpu().detach().numpy())
    #_, max_ix = torch.max(pred[i])
    print(item, testDL.pred_to_cat(pred[i]))

for word in testDL.words:
    i = testDL.word_enc([word])
    if cuda:
        i = i.cuda()
    predT = model(i)
    cat = testDL.pred_to_cat(predT)
    print(f'{word}: {cat}')
