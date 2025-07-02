{contract.contract_start_date
  ? format(parseISO(contract.contract_start_date), "dd-MM-yyyy")
  : "N/A"}
<span className="text-slate-400 dark:text-slate-500"> to </span>
{contract.contract_end_date
  ? format(parseISO(contract.contract_end_date), "dd-MM-yyyy")
  : "N/A"} 