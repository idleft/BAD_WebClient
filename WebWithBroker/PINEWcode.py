'''
module   : PINEW

function :
           matcher()
           div()
           ngram()
           simf()
           exper()
           
author   : ideamaxwu
'''
import traceback
import random
import copy
import time
import math
import sys
import json
import urllib
import re
from urllib.request import urlopen
import codecs

def isint(value):
        try:
            int(value)
            return True
        except:
            return False
def boolval(value):
        if value == 'True':
            return True
        else:
            return False
    

'''
PINEW class
'''
class Obj:
    def __init__(self):
        self.oid=0
        self.ens={}
        self.tps={}
'''
#PINEW iniitializing...
'''
filepath='PINWeb/GKG/'
serviceurl='https://kgsearch.googleapis.com/v1/entities:search'
apikey=open('PINWeb/.api_key').read()

'''
#PINEW.matcher [query pinenrich.txt] [pinsim.txt]
'''

def matcher(qitems,fname='teew',opt=False):
    query=qitems
    infile=fname+'_small_gkg.txt'
    outfile=fname+'_small_sim.txt'
    print("matcher start...")
    qobj=Obj()
    entityscore={}
    entitycnt={}
    typecnt={}
    typetotal=0
    #
    # Query Enrich
    #
    st=time.time()
    for qitem in query:
        service_url = serviceurl
        params = {
            'key': apikey,
            'query': qitem,
            'indent': True,
            'limit': '5'
            }
        url = service_url + '?' + urllib.parse.urlencode(params)
        response = json.loads(urlopen(url).read().decode('utf-8'))
        for result in response['itemListElement']:
                if 'name' in  result['result'].keys():
                    ekey=result['result']['name']
                else:
                    ekey=result['result']['@id'].strip('kg:')
                if ekey not in entityscore:
                    entityscore[ekey]=result['resultScore']
                else:
                    entityscore[ekey]=entityscore[ekey]+result['resultScore']
                entitycnt[ekey]=1
                for tkey in result['result']['@type']:
                    if tkey not in typecnt:
                        typecnt[tkey]=1
                    else:
                        typecnt[tkey]=typecnt[tkey]+1
                    typetotal=typetotal+1
    for ekey in entityscore.keys():
        #rekey=ekey.replace(": ","@#$").replace("://","@#$").replace(":A.","@#$")
        qobj.ens[ekey]=entityscore[ekey]
    for tkey in typecnt.keys():
        qobj.tps[tkey]=typecnt[tkey]/typetotal
    se=time.time()
    #
    # Linked Entity Similarity
    #
    fin=codecs.open(filepath+infile,'r','utf-8')
    tobjs =[]
    line=fin.readline()
    while line:
        try:        
            tobj=Obj()
            terms=line.strip('|\n').split('\t')
            tobj.oid=terms[0]
            ens=terms[1].strip('|').split('|')
            if ens==['']:
                line=fin.readline()
                continue
            for item in ens:
                ele=item.rsplit(':',1)
                if ele[0]==[''] or len(ele)==1:
                    line=fin.readline()
                    continue
                e=ele[1].split('*')
                tobj.ens[ele[0]]=float(e[0])*int(e[1])
            tps=terms[2].split('|')
            for item in tps:
                ele=item.split(':')
                tobj.tps[ele[0]]=ele[1]
            tobjs.append(tobj)
            line=fin.readline()
        except Exception as e:
            print(line+'\n'+str(e))
            traceback.print_exc()
    fin.close()
    fout=open(filepath+outfile,'w')
    optobjs=[]
    for tobj in tobjs:
        simsum=0
        for qe in qobj.ens:
            for te in tobj.ens:
                if qe==te:
                    simsum=simsum+qobj.ens[qe]*tobj.ens[te]
        if opt==True:
            if simsum==0:
                continue
            else:
                fout.writelines(tobj.oid+":"+str(simsum)+"\n")
                optobjs.append(tobj)
        else:
            fout.writelines(tobj.oid+":"+str(simsum)+"\n")
    fout.close()
    if opt==True:
        return se-st,qobj,optobjs
    print("matcher end!")
    return se-st,qobj,tobjs

'''
#PINEW.div [qtopics rtopics] [time diven divco]
'''
def div(qset={'Movie': 0.0625, 'Person': 0.3125},olist=[{'Person': 0.325, 'Thing': 0.625},{'Movie': 0.043478260869565216, 'Thing': 0.43478260869565216, 'Event': 0.043478260869565216}]):
    st=time.time()
    l=len(qset)
    hmax=-math.log(1/l)
    cdict={}
    n=0
    for (k,v) in qset.items():
        m=0
        for item in olist:
            if k in item.keys():
                m=m+1
        cdict[k]=m
        n=n+m
    h=0
    for (k,v) in cdict.items():
        p=v/n
        if p!=0:
            h=h-p*math.log(p)
    union={}
    for item in olist:
        union = dict(union,**item)
    inter=dict.fromkeys([x for x in qset if x in union])
    se=time.time()
    if l==1:
        return se-st,1,1
    return se-st,h/hmax,len(inter)/l

'''
#PINEW.ngram [k query datasetname] [NGRAMresults]
'''
def ngram(k,qitems,fname):
    fin=open('PINWeb/PHRASE/'+fname+'_small_phrases.txt','r')
    i=0
    odict={}
    line=fin.readline()
    while line:
        odict[i]=line.strip()
        i=i+1
        line=fin.readline()
    fin.close()
    topk=[]
    while k>0:
        tmpid=0
        tmpcnt=-1
        for (ky,v) in odict.items():
            itms=v.split(',')
            inter=[val for val in itms if val in qitems]
            if len(inter)>tmpcnt:
                tmpcnt=len(inter)
                tmpid=ky
        topk.append(str(tmpid))
        del odict[tmpid]
        k=k-1     
    return topk

'''
#PINEW.simf [datasetname query PINresults] [time simscore]
'''
def simf(fname,qitems,exp=[2,3,4]):
    st=time.time()
    k=len(exp)
    stan=ngram(k,qitems,fname)
    r=[val for val in stan if val in exp]
    se=time.time()

    return se-st,len(r)/k

'''
#PINEW.finder [query k qk datasetname opt divfree] [print results]
'''
def finder(query=['starbuck','coffee'],k=3,fname='teew',opt=False,divfree=False):
    print("finder start...")
    start=time.time()

    reslist=[]
    K=k
    qfreq=1
    inis=0
    dives=0
    divts=0
    divcs=0
    simts=0
    sims=0
    
    qitems=query
    qk=str(len(qitems))
    infile=fname+'_small_sim.txt'
    ini,qobj,tobjs=matcher(qitems,fname,opt)
    inis=ini+inis
    print('\t>>>[Query.Phrase]'+str(qitems))
    #print('\t>>>[Query.Entities]'+str(qobj.ens))
    #print('\t>>>[Query.Topics]'+str(qobj.tps))
    
    #
    # Crowd Formation
    #
    fin=open(filepath+infile,'r')

    sim={}
    line=fin.readline()

    while line:
        item=line.strip('\n').split(':')
        sim[item[0]]=item[1]
        line=fin.readline()
    fin.close()
    cov=[]
    toptps=[]#for div
    topids=[]
    qtps=copy.deepcopy(qobj.tps)
    while k>0:
        ttobj=Obj()
        tscore=-1
        tcov=[]
        if len(tobjs)==0:
            break
        for tobj in tobjs:
            tempscore=0
            tempcov=[]
            if divfree==True:
                tempscore=tempscore+float(sim[tobj.oid])
            else:
                if qobj.tps!={}:
                    for qt in qobj.tps:
                        for tt in tobj.tps:
                            if qt==tt:
                                tempscore=tempscore+float(sim[tobj.oid])*float(qobj.tps[qt])*float(tobj.tps[tt])
                                tempcov.append(qt)
                else:
                    for qt in qtps:
                        for tt in tobj.tps:
                            if qt==tt:
                                tempscore=tempscore+float(sim[tobj.oid])*float(qtps[qt])*float(tobj.tps[tt])
            if tempscore>tscore:
                ttobj=tobj
                tscore=tempscore
                tcov=tempcov
        print('\t>>>[Result No.'+str(K-k+1)+']\tID: '+str(ttobj.oid)+'\tScore: '+str(tscore))
        reslist.append('[Result No.'+str(K-k+1)+']\tID: '+str(ttobj.oid)+'\tScore: '+str(tscore))
        toptps.append(ttobj.tps)
        topids.append(ttobj.oid)
        tobjs.remove(ttobj)
        for itcov in tcov:
            qobj.tps.pop(itcov,None)
        k=k-1
    divt,dive,divc=div(qtps,toptps)
    dives=dives+dive
    divts=divts+divt
    divcs=divcs+divc

    simt,sim=simf(fname,qitems,topids)
    simts=simts+simt
    sims=sims+sim
    end=time.time()
    k=K
    print("finder end!")
    title='[K]: '+str(k)+'\t[qK]: '+str(qk)+'\t[DATASET]: '+fname+'\t[OPT]: '+str(opt)+'\t[DIVFREE]: '+str(divfree)
    print('\t>>>'+title)
    #print('\t>>>[TIME eclipsed]: '+str((end-start-inis-divts-simts)/qfreq)+'s')
    #print('\t>>>[IDs]: '+str(topids))
    #print('\t>>>[DIVent]: '+str(dives/qfreq)+'\t[DIVcov]: '+str(divcs/qfreq))
    #print('\t>>>[SIM]: '+str(sims/qfreq))
    out='[TIME eclipsed]: '+str((end-start-inis-divts-simts)/qfreq)+'s\t[DIVent]: '+str(dives/qfreq)+'\t[DIVcov]: '+str(divcs/qfreq)+'\t[SIM]: '+str(sims/qfreq)
    print('\t>>>'+out)
    return qitems,reslist,title,out
#finder(['starbuck','coffee'],5,'teew',False,False)
