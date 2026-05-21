using Microsoft.Data.Sqlite;

namespace VehicleService.CreateTable
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Creating Reservations table...");

            string connectionString = "Data Source=../vehicles.db";
            string sql = File.ReadAllText("../add_reservations_only.sql");

            using var connection = new SqliteConnection(connectionString);
            connection.Open();

            // Split SQL commands by semicolon and execute each one
            string[] commands = sql.Split(';', StringSplitOptions.RemoveEmptyEntries);

            foreach (string command in commands)
            {
                string trimmedCommand = command.Trim();
                if (!string.IsNullOrEmpty(trimmedCommand))
                {
                    try
                    {
                        using var cmd = new SqliteCommand(trimmedCommand, connection);
                        cmd.ExecuteNonQuery();
                        Console.WriteLine($"Executed: {trimmedCommand.Substring(0, Math.Min(50, trimmedCommand.Length))}...");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error executing command: {ex.Message}");
                        Console.WriteLine($"Command: {trimmedCommand}");
                    }
                }
            }

            Console.WriteLine("Done!");
        }
    }
}
