import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  LayoutDashboard, FolderOpen, WalletCards, BarChart3, Settings, Menu, X,
  Plus, Search, ScanLine, Camera, Upload, FileText, Receipt, CheckCircle2,
  AlertTriangle, ChevronRight, Download, Sparkles, FileSearch,
  PieChart, CalendarDays, ArrowUpRight, ArrowDownRight, Building2, Filter,
  ShieldCheck, FileCheck2, WandSparkles, CircleDollarSign
} from 'lucide-react';
import './styles.css';

const starterDocs = [
  {id:1,name:'FV_09_2026_Biuro.pdf',type:'Faktura',date:'05.09.2026',amount:1249.00,status:'Kompletna',missing:[],category:'Biuro'},
  {id:2,name:'paragon_paliwo.jpg',type:'Paragon',date:'04.09.2026',amount:268.40,status:'Brak danych',missing:['NIP sprzedawcy'],category:'Transport'},
  {id:3,name:'umowa_marketing.pdf',type:'Umowa',date:'02.09.2026',amount:0,status:'Do weryfikacji',missing:['Data zakończenia'],category:'Umowy'},
  {id:4,name:'FV_laptop.pdf',type:'Faktura',date:'30.08.2026',amount:4599.00,status:'Kompletna',missing:[],category:'Sprzęt'},
];

const navItems = [
  ['Pulpit', LayoutDashboard],
  ['Skanuj', ScanLine],
  ['Dokumenty', FolderOpen],
  ['Finanse', WalletCards],
  ['Raporty', BarChart3],
  ['Ustawienia', Settings],
];

const currency = n => new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN'}).format(n);

function detectType(name='') {
  const n = name.toLowerCase();
  if (n.includes('paragon') || n.includes('receipt')) return 'Paragon';
  if (n.includes('umowa') || n.includes('contract')) return 'Umowa';
  if (n.includes('wyciag') || n.includes('statement')) return 'Wyciąg bankowy';
  if (n.includes('rachunek')) return 'Rachunek';
  return 'Faktura';
}

function App(){
  const [tab,setTab]=useState('Pulpit');
  const [mobile,setMobile]=useState(false);
  const [docs,setDocs]=useState(starterDocs);
  const [query,setQuery]=useState('');
  const [drag,setDrag]=useState(false);
  const [selected,setSelected]=useState(null);
  const fileRef=useRef(null);

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q) return docs;
    return docs.filter(d => [d.name,d.type,d.status,d.category,...d.missing].join(' ').toLowerCase().includes(q));
  },[docs,query]);

  const revenue=18420.40;
  const expenses=docs.reduce((sum,d)=>sum+(d.type==='Paragon'||d.type==='Faktura'?d.amount:0),0)+2140.00;
  const profit=revenue-expenses;
  const missingCount=docs.filter(d=>d.missing.length).length;

  function addFiles(fileList){
    const files=Array.from(fileList||[]);
    if(!files.length) return;
    const created=files.map((f,i)=>{
      const type=detectType(f.name);
      const missing = i % 3 === 1 ? ['Termin płatności'] : [];
      return {
        id:Date.now()+i,
        name:f.name,
        type,
        date:new Date().toLocaleDateString('pl-PL'),
        amount:type==='Umowa'?0:Math.round((60+Math.random()*1200)*100)/100,
        status:missing.length?'Brak danych':'Kompletna',
        missing,
        category:type==='Paragon'?'Zakupy':'Dokumenty'
      };
    });
    setDocs(prev=>[...created,...prev]);
  }

  function Dashboard(){
    return <>
      <section className="hero">
        <div>
          <span className="eyebrow"><Sparkles size={15}/> Inteligentne centrum dokumentów</span>
          <h2>Od zdjęcia dokumentu<br/>do gotowego raportu.</h2>
          <p>Prześlij fakturę, paragon, umowę lub PDF. DokumentFlow porządkuje dane, wykrywa braki i pomaga kontrolować finanse firmy.</p>
          <div className="hero-actions">
            <button className="primary large" onClick={()=>fileRef.current?.click()}><Upload size={18}/> Prześlij dokument</button>
            <button className="ghost large" onClick={()=>setTab('Skanuj')}><Camera size={18}/> Skanuj aparatem</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="scan-card">
            <div className="doc-mini-head"><FileText size={18}/><span>FV_09_2026.pdf</span><CheckCircle2 size={18}/></div>
            <div className="scan-line"/>
            <div className="data-row"><span>Sprzedawca</span><b>Nova Office Sp. z o.o.</b></div>
            <div className="data-row"><span>NIP</span><b>525•••••••</b></div>
            <div className="data-row"><span>Kwota brutto</span><b>1 249,00 zł</b></div>
            <div className="data-row"><span>Status</span><b className="ok">Dane kompletne</b></div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <Stat title="Przychody" value={currency(revenue)} delta="+12,4%" icon={ArrowUpRight}/>
        <Stat title="Wydatki" value={currency(expenses)} delta="-4,2%" icon={ArrowDownRight}/>
        <Stat title="Zysk" value={currency(profit)} delta="+18,1%" icon={CircleDollarSign}/>
        <Stat title="Dokumenty z brakami" value={String(missingCount)} delta="Do poprawy" icon={AlertTriangle} warn/>
      </section>

      <section className="grid-two">
        <div className="panel">
          <div className="panel-head"><div><h3>Dodaj dokument</h3><p>PDF, JPG, PNG lub zdjęcie z telefonu</p></div></div>
          <Dropzone drag={drag} setDrag={setDrag} addFiles={addFiles} input={fileRef}/>
        </div>
        <div className="panel">
          <div className="panel-head"><div><h3>Co robi DokumentFlow?</h3><p>Jeden proces zamiast kilku aplikacji</p></div></div>
          <div className="steps">
            {[
              ['1','Skanuje','Zdjęcia, PDF-y i dokumenty'],
              ['2','Rozpoznaje','Typ dokumentu i najważniejsze pola'],
              ['3','Sprawdza','Brakujące lub podejrzane dane'],
              ['4','Porządkuje','Kategorie, daty, kontrahenci'],
              ['5','Liczy','Wydatki, przychody i wyniki'],
              ['6','Raportuje','Podsumowania do PDF i Excel'],
            ].map(([n,a,b])=><div className="step" key={n}><span>{n}</span><div><b>{a}</b><small>{b}</small></div></div>)}
          </div>
        </div>
      </section>

      <DocumentsTable compact />
    </>;
  }

  function Scanner(){
    return <section className="page-section">
      <div className="section-intro">
        <span className="eyebrow"><ScanLine size={15}/> Skanowanie dokumentów</span>
        <h2>Zeskanuj lub prześlij dokument</h2>
        <p>System przygotowany pod OCR i automatyczne rozpoznawanie danych. W tej wersji demonstracyjnej dodane pliki są analizowane przykładowo w przeglądarce.</p>
      </div>
      <div className="scan-layout">
        <Dropzone drag={drag} setDrag={setDrag} addFiles={addFiles} input={fileRef} big />
        <div className="panel">
          <h3>Obsługiwane dokumenty</h3>
          <div className="type-list">
            <Type icon={FileText} title="Faktury" text="Kwoty, NIP, daty, terminy płatności"/>
            <Type icon={Receipt} title="Paragony" text="Sprzedawca, data, suma, kategoria"/>
            <Type icon={FileCheck2} title="Umowy" text="Strony, daty, terminy, wartości"/>
            <Type icon={Building2} title="Wyciągi bankowe" text="Transakcje, wpływy, wydatki"/>
          </div>
        </div>
      </div>
    </section>;
  }

  function DocumentsTable({compact=false}){
    return <section className="panel docs-panel">
      <div className="panel-head table-head">
        <div><h3>{compact?'Ostatnie dokumenty':'Wszystkie dokumenty'}</h3><p>{docs.length} dokumentów w systemie</p></div>
        <div className="table-actions">
          {!compact && <div className="searchbox"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Szukaj dokumentu..."/></div>}
          <button className="icon-btn" aria-label="Filtruj"><Filter size={18}/></button>
          <button className="icon-btn" aria-label="Eksportuj"><Download size={18}/></button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Dokument</th><th>Typ</th><th>Data</th><th>Kwota</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {(compact?docs.slice(0,4):filtered).map(d=><tr key={d.id} onClick={()=>setSelected(d)}>
              <td><div className="file-cell"><span className="file-icon"><FileText size={18}/></span><div><b>{d.name}</b><small>{d.category}</small></div></div></td>
              <td>{d.type}</td><td>{d.date}</td><td>{d.amount?currency(d.amount):'—'}</td>
              <td>{d.missing.length?<span className="status bad"><AlertTriangle size={14}/> {d.status}</span>:<span className="status good"><CheckCircle2 size={14}/> Kompletna</span>}</td>
              <td><ChevronRight size={18}/></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {compact && <button className="text-link" onClick={()=>setTab('Dokumenty')}>Zobacz wszystkie dokumenty <ChevronRight size={16}/></button>}
    </section>;
  }

  function Finance(){
    return <section className="page-section">
      <div className="section-intro"><span className="eyebrow"><WalletCards size={15}/> Finanse</span><h2>Kontroluj pieniądze bez ręcznego przepisywania</h2><p>Dokumenty finansowe tworzą jedno przejrzyste podsumowanie.</p></div>
      <section className="stats-grid">
        <Stat title="Przychody" value={currency(revenue)} delta="Wrzesień 2026" icon={ArrowUpRight}/>
        <Stat title="Wydatki" value={currency(expenses)} delta="Wrzesień 2026" icon={ArrowDownRight}/>
        <Stat title="Zysk" value={currency(profit)} delta="Bieżący wynik" icon={CircleDollarSign}/>
        <Stat title="Do zapłaty" value={currency(2180)} delta="3 faktury" icon={CalendarDays} warn/>
      </section>
      <div className="grid-two">
        <div className="panel">
          <div className="panel-head"><div><h3>Wydatki według kategorii</h3><p>Bieżący miesiąc</p></div><PieChart size={20}/></div>
          <div className="bars">
            {[['Sprzęt',4599,65],['Biuro',1249,28],['Transport',268,16],['Usługi',2140,38]].map(([name,val,width])=><div className="bar-row" key={name}><div><span>{name}</span><b>{currency(val)}</b></div><div className="bar"><i style={{width:`${width}%`}}/></div></div>)}
          </div>
        </div>
        <div className="panel">
          <h3>Automatyczne kontrole</h3>
          <div className="checks">
            <Check text="Wykrywanie duplikatów faktur" />
            <Check text="Brakujące NIP, daty i terminy" />
            <Check text="Kategoryzacja wydatków" />
            <Check text="Przypomnienia o płatnościach" />
            <Check text="Miesięczne podsumowanie firmy" />
          </div>
        </div>
      </div>
    </section>;
  }

  function Reports(){
    return <section className="page-section">
      <div className="section-intro"><span className="eyebrow"><BarChart3 size={15}/> Raporty</span><h2>Gotowe raporty jednym kliknięciem</h2><p>Przygotuj zestawienie dla siebie, księgowej lub firmy.</p></div>
      <div className="report-grid">
        {[
          ['Raport miesięczny','Przychody, wydatki, zysk i podsumowanie','PDF'],
          ['Rejestr wydatków','Lista kosztów z kategoriami i dokumentami','XLSX'],
          ['Dokumenty z brakami','Lista pozycji wymagających poprawy','PDF'],
          ['Zestawienie faktur','Faktury, kontrahenci, terminy i statusy','XLSX'],
        ].map(([a,b,c])=><div className="report-card" key={a}><div className="report-icon"><BarChart3/></div><h3>{a}</h3><p>{b}</p><button className="secondary"><Download size={17}/> Eksportuj {c}</button></div>)}
      </div>
    </section>;
  }

  function SettingsPage(){
    return <section className="page-section">
      <div className="section-intro"><span className="eyebrow"><Settings size={15}/> Ustawienia</span><h2>Ustawienia firmy</h2><p>Dane wykorzystywane przy organizacji dokumentów i raportowaniu.</p></div>
      <div className="panel form-panel">
        <label>Nazwa firmy<input defaultValue="Moja Firma Sp. z o.o."/></label>
        <label>NIP<input defaultValue="5250000000"/></label>
        <label>Waluta<select defaultValue="PLN"><option>PLN</option><option>EUR</option><option>USD</option></select></label>
        <label>Język<select defaultValue="pl"><option value="pl">Polski</option></select></label>
        <button className="primary">Zapisz ustawienia</button>
      </div>
    </section>;
  }

  function renderTab(){
    if(tab==='Pulpit') return <Dashboard/>;
    if(tab==='Skanuj') return <Scanner/>;
    if(tab==='Dokumenty') return <DocumentsTable/>;
    if(tab==='Finanse') return <Finance/>;
    if(tab==='Raporty') return <Reports/>;
    return <SettingsPage/>;
  }

  return <div className="app">
    <aside className="sidebar desktop-sidebar">
      <Logo/>
      <Nav current={tab} onSelect={setTab}/>
      <div className="secure"><ShieldCheck size={19}/><div><b>Twoje dane</b><small>Bezpieczne centrum dokumentów</small></div></div>
    </aside>

    {mobile && <div className="mobile-overlay" onClick={()=>setMobile(false)}>
      <aside className="mobile-sidebar" onClick={e=>e.stopPropagation()}>
        <div className="mobile-top"><Logo/><button className="icon-btn" aria-label="Zamknij menu" onClick={()=>setMobile(false)}><X/></button></div>
        <Nav current={tab} onSelect={(v)=>{setTab(v);setMobile(false)}}/>
      </aside>
    </div>}

    <main className="main">
      <header className="topbar">
        <button className="icon-btn menu-btn" aria-label="Otwórz menu" onClick={()=>setMobile(true)}><Menu/></button>
        <div className="top-title"><h1>{tab}</h1><span>Dokumenty • Finanse • Raporty</span></div>
        <div className="top-actions">
          <button className="secondary search-button"><Search size={18}/><span>Szukaj</span></button>
          <button className="primary" onClick={()=>fileRef.current?.click()}><Plus size={18}/><span>Dodaj dokument</span></button>
        </div>
      </header>
      <div className="content">{renderTab()}</div>
      <footer className="site-footer">
        <div><b>DokumentFlow</b><span>Dokumenty, finanse i raporty w jednym miejscu.</span></div>
        <div className="footer-links">
          <a href="/privacy-policy.html">Polityka prywatności</a>
          <a href="/terms.html">Regulamin</a>
          <a href="/cookies.html">Cookies</a>
          <a href="/about.html">O nas</a>
          <a href="/contact.html">Kontakt</a>
        </div>
      </footer>
    </main>

    {selected && <div className="modal-backdrop" onClick={()=>setSelected(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button className="close" aria-label="Zamknij" onClick={()=>setSelected(null)}><X/></button>
        <div className="modal-icon"><FileSearch/></div>
        <span className="eyebrow">Analiza dokumentu</span>
        <h2>{selected.name}</h2>
        <div className="analysis-grid">
          <div><span>Typ</span><b>{selected.type}</b></div>
          <div><span>Data</span><b>{selected.date}</b></div>
          <div><span>Kwota</span><b>{selected.amount?currency(selected.amount):'—'}</b></div>
          <div><span>Kategoria</span><b>{selected.category}</b></div>
        </div>
        {selected.missing.length ? <div className="warning-box"><AlertTriangle/><div><b>Wykryto brakujące informacje</b>{selected.missing.map(x=><span key={x}>{x}</span>)}</div></div>
        : <div className="success-box"><CheckCircle2/><div><b>Dokument wygląda na kompletny</b><span>Nie wykryto brakujących kluczowych pól.</span></div></div>}
        <div className="modal-actions"><button className="secondary"><Download size={17}/> Pobierz</button><button className="primary"><WandSparkles size={17}/> Otwórz analizę</button></div>
      </div>
    </div>}
  </div>;
}

function Logo(){
  return <div className="logo"><div className="logo-mark"><ScanLine size={23}/></div><div><b>DokumentFlow</b><span>Smart Business Docs</span></div></div>;
}
function Nav({current,onSelect}){
  return <nav className="nav">{navItems.map(([name,Icon])=><button key={name} className={current===name?'nav-item active':'nav-item'} onClick={()=>onSelect(name)}><Icon size={19}/><span>{name}</span></button>)}</nav>;
}
function Stat({title,value,delta,icon:Icon,warn}){
  return <div className="stat-card"><div className={warn?'stat-icon warn':'stat-icon'}><Icon size={20}/></div><span>{title}</span><strong>{value}</strong><small>{delta}</small></div>;
}
function Dropzone({drag,setDrag,addFiles,input,big}){
  return <div className={drag?`dropzone ${big?'big':''} drag`:`dropzone ${big?'big':''}`}
    onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
    onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files)}} onClick={()=>input.current?.click()}>
    <input ref={input} hidden type="file" multiple accept=".pdf,image/*,.doc,.docx,.xls,.xlsx" onChange={e=>addFiles(e.target.files)}/>
    <div className="upload-icon"><Upload size={28}/></div>
    <h3>Przeciągnij dokument tutaj</h3>
    <p>lub kliknij, aby wybrać plik z urządzenia</p>
    <div className="file-types"><span>PDF</span><span>JPG</span><span>PNG</span><span>DOCX</span><span>XLSX</span></div>
    {big && <button className="primary"><Plus size={17}/> Wybierz dokument</button>}
  </div>;
}
function Type({icon:Icon,title,text}){
  return <div className="type-item"><span><Icon size={20}/></span><div><b>{title}</b><small>{text}</small></div></div>;
}
function Check({text}){
  return <div className="check-item"><CheckCircle2 size={19}/><span>{text}</span></div>;
}

createRoot(document.getElementById('root')).render(<App/>);
