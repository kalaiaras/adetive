<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'username' => 'Admin kalai',
            'email' => 'admin@example.com',
            'password' => Hash::make('123456'),
            'role' => 'admin', // Assuming 'role' field in users table for user roles
        ]);
    }
}
