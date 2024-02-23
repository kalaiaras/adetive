<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('customer_id_in_invoices', function (Blueprint $table) {
            //
            $table->renameColumn('service_id', 'customer_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('customer_id_in_invoices', function (Blueprint $table) {
            //
            $table->renameColumn('customer_id', 'service_id');
        });
    }
};
