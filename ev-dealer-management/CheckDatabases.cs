using Microsoft.Data.Sqlite;

Console.WriteLine("Checking Reservations table...");

string vehicleDbPath = @"ev-dealer-management\VehicleService\vehicles.db";
string customerDbPath = @"ev-dealer-management\CustomerService\customers.db";

// Check VehicleService database
Console.WriteLine("\n=== VehicleService Database (vehicles.db) ===");
if (File.Exists(vehicleDbPath))
{
    using var vehicleConnection = new SqliteConnection($"Data Source={vehicleDbPath}");
    vehicleConnection.Open();

    // List all tables
    using var cmd1 = new SqliteCommand("SELECT name FROM sqlite_master WHERE type='table';", vehicleConnection);
    using var reader1 = cmd1.ExecuteReader();
    Console.WriteLine("Tables:");
    while (reader1.Read())
    {
        Console.WriteLine($"  - {reader1.GetString(0)}");
    }
    reader1.Close();

    // Check if Reservations table exists and has data
    try
    {
        using var cmd2 = new SqliteCommand("SELECT COUNT(*) FROM Reservations;", vehicleConnection);
        var count = cmd2.ExecuteScalar();
        Console.WriteLine($"Reservations table exists with {count} records");

        if (Convert.ToInt32(count) > 0)
        {
            using var cmd3 = new SqliteCommand("SELECT * FROM Reservations LIMIT 5;", vehicleConnection);
            using var reader3 = cmd3.ExecuteReader();
            Console.WriteLine("Sample records:");
            while (reader3.Read())
            {
                Console.WriteLine($"  ID: {reader3["Id"]}, Customer: {reader3["CustomerName"]}, Email: {reader3["CustomerEmail"]}, Status: {reader3["Status"]}");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error checking Reservations table: {ex.Message}");
    }
}
else
{
    Console.WriteLine("vehicles.db not found");
}

// Check CustomerService database
Console.WriteLine("\n=== CustomerService Database (customers.db) ===");
if (File.Exists(customerDbPath))
{
    using var customerConnection = new SqliteConnection($"Data Source={customerDbPath}");
    customerConnection.Open();

    // List all tables
    using var cmd1 = new SqliteCommand("SELECT name FROM sqlite_master WHERE type='table';", customerConnection);
    using var reader1 = cmd1.ExecuteReader();
    Console.WriteLine("Tables:");
    while (reader1.Read())
    {
        Console.WriteLine($"  - {reader1.GetString(0)}");
    }
    reader1.Close();

    // Check if Customers table exists and has data
    try
    {
        using var cmd2 = new SqliteCommand("SELECT COUNT(*) FROM Customers;", customerConnection);
        var count = cmd2.ExecuteScalar();
        Console.WriteLine($"Customers table exists with {count} records");

        if (Convert.ToInt32(count) > 0)
        {
            using var cmd3 = new SqliteCommand("SELECT * FROM Customers ORDER BY CreatedAt DESC LIMIT 5;", customerConnection);
            using var reader3 = cmd3.ExecuteReader();
            Console.WriteLine("Recent customer records:");
            while (reader3.Read())
            {
                var source = reader3.IsDBNull("Source") ? "NULL" : reader3["Source"].ToString();
                Console.WriteLine($"  ID: {reader3["Id"]}, Name: {reader3["Name"]}, Email: {reader3["Email"]}, Source: {source}");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error checking Customers table: {ex.Message}");
    }
}
else
{
    Console.WriteLine("customers.db not found");
}

Console.WriteLine("\nDone!");