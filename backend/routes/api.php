<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\CustomerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post("/register", [UserController::class, "signup"]);
Route::post("/login", [UserController::class, "login"]);


Route::group(['prefix' => 'customers'], function () {
    Route::get('/{userid}', [CustomerController::class, 'index'])->name('customers.index');
    Route::post('/', [CustomerController::class, 'store'])->name('customers.store');
    Route::get('/{id}', [CustomerController::class, 'show'])->name('customers.show');
    Route::get('/{id}/edit', [CustomerController::class, 'edit'])->name('customers.edit');
    Route::put('/{id}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/{id}', [CustomerController::class, 'destroy'])->name('customers.destroy');
});

Route::group(['prefix' => 'services'], function () {
    Route::get('/{customer_id}', [ServiceController::class, 'index'])->name('services.index');
    Route::get('/create', [ServiceController::class, 'create'])->name('services.create');
    Route::post('/', [ServiceController::class, 'store'])->name('services.store');
    Route::get('/{id}', [ServiceController::class, 'show'])->name('services.show');
    Route::get('/{id}/edit', [ServiceController::class, 'edit'])->name('services.edit');
    Route::put('/{id}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('/{id}', [ServiceController::class, 'destroy'])->name('services.destroy');
});

Route::group(['prefix' => 'invoices'], function () {
    Route::get('/', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/user/{id}', [InvoiceController::class, 'user'])->name('invoices.user');
    Route::get('/create', [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('/', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('/{id}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::get('/{id}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit');
    Route::put('/{id}', [InvoiceController::class, 'update'])->name('invoices.update');
    Route::delete('/{id}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
});



