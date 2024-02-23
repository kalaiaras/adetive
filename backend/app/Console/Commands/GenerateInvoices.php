<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Invoice;


class GenerateInvoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $users = User::all();

        foreach ($users as $user){
            $invoice = new Invoice();
             $invoice->user_id = $user->id;
            $totalAmount = $this->calculateInvoiceAmount($user);
             $invoice->amount = $totalAmount;
            $invoice->status = 'Pending'; 
             $invoice->save();   

      

        }
        $this->info('Invoices generated successfully.');
        return Command::SUCCESS;
    }

    private function calculateInvoiceAmount($user){
        $totalAmount = $user->services()->sum('rate');
        return $totalAmount;
    }
}
