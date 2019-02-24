using System;
using CredentialManagement;

namespace WindowsCredentials
{
    class UserPass
    {
        public string user;
        public string password;
        public UserPass(string user, string password) {
            this.user = user;
            this.password = password;
        }

        public bool check(string user, string password) {
            return this.user == user && this.password == password;
        }

        public string ToJsonString()
        {
            return "{ \"user\":\"" + this.user + "\", \"password\":\"" + this.password + "\" }";
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            string domain = null;
            string user = null;
            string password = null;
            UserPass userpass = null;
            switch (args.Length) {
                case 2:
                    if (args[0] == "delete")
                    {
                        domain = args[1];
                        RemoveCredentials(domain);
                        bool removed = GetCredential(domain) == null;
                        Console.WriteLine("{ \"domain\":\"" + domain + "\", \"removed\":" + removed.ToString().ToLower() + " }");
                    }
                    break;
                case 3:
                    domain = args[0];
                    user = args[1];
                    password = args[2];
                    userpass = GetCredential(domain);
                    string json = "";
                    if (userpass != null)
                    {
                        json = "{ \"domain\":\"" + domain + "\", \"user\":\"" + user + "\", \"authorized\":" + userpass.check(user, password).ToString().ToLower() + "}";
                    }
                    else {
                        json = "{ \"domain\":\"" + domain + "\", \"error\":\"Domain does not exist.\" }";
                    }
                    Console.WriteLine(json);
                    break;
                case 4:
                    if(args[0] == "create")
                    {
                        domain = args[1];
                        user = args[2];
                        password = args[3];
                        SetCredentials(domain, user, password, PersistanceType.LocalComputer);
                        var timestamp = DateTime.Now;
                        Console.WriteLine("{ \"domain\":\"" + domain + "\", \"user\":\"" + user + "\", \"dateCreated\":\"" + timestamp + "\" }");
                    }
                    break;
            }
        }

        public static UserPass GetCredential(string target)
        {
            var cm = new Credential { Target = target };
            if (!cm.Load())
            {
                return null;
            }

            //UserPass is just a class with two string properties for user and pass
            return new UserPass(cm.Username, cm.Password);
        }

        public static bool SetCredentials(
             string target, string username, string password, PersistanceType persistenceType)
        {
            return new Credential
            {
                Target = target,
                Username = username,
                Password = password,
                PersistanceType = persistenceType
            }.Save();
        }

        public static bool RemoveCredentials(string target)
        {
            return new Credential { Target = target }.Delete();
        }
    }
}
