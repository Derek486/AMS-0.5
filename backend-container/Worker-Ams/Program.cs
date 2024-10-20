using Microsoft.EntityFrameworkCore;
using Worker_Ams.Authentication;
using Worker_Ams.Database;
using Worker_Ams.Endpoints;
using Worker_Ams.Exntensions;
using Worker_Ams.Repositories.Datos;
using Worker_Ams.Repositories.Motors;
using Worker_Ams.Repositories.Users;
using Worker_Ams.Services.Jwt;
using Worker_Ams.Services.Kafka;

DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);
const string cors = "Cors";

string PG_HOST = Environment.GetEnvironmentVariable("POSTGRES_HOST") ?? "localhost";
string PG_PORT = Environment.GetEnvironmentVariable("POSTGRES_PORT") ?? "5432";
string PG_DB = Environment.GetEnvironmentVariable("POSTGRES_DB")!;
string PG_USER = Environment.GetEnvironmentVariable("POSTGRES_USER")!;
string PG_PASSWORD = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD")!;

string databaseConnectionString = $"Server={PG_HOST};Port={PG_PORT};Database={PG_DB};Username={PG_USER};Password={PG_PASSWORD};Include Error Detail=true";

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen()
    .AddAuthentication(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: cors,
        corsPolicyBuilder =>
        {
            corsPolicyBuilder.WithOrigins("*");
            corsPolicyBuilder.AllowAnyMethod();
            corsPolicyBuilder.AllowAnyHeader();
        });
});

builder.Services.AddDbContext<ApplicationDbContext>((options) =>
{
    options.UseNpgsql(databaseConnectionString);
});

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));

builder.Services.AddAuthorization();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMotorRepository, MotorRepository>();
builder.Services.AddScoped<IDatosRepository, DatosRepository>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

builder.Services.Configure<KafkaSettings>(options =>
{
    options.BootstrapServers = Environment.GetEnvironmentVariable("KAFKA_HOST") ?? "localhost:9092";
    options.Topic = Environment.GetEnvironmentVariable("KAFKA_TOPIC") ?? "test-topic";
});

builder.Services.AddHostedService<Consumer>();

var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI();

app.MapUserEndpoints();

app.MapMotorEndpoints();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.ApplyMigrations();

app.UseCors(cors);

app.Run();

public partial class Program;