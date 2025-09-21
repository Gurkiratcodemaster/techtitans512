"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ClientDatabaseService } from "@/lib/client-database";

export default function DataMigrationPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<{
    success: boolean;
    message: string;
    error?: string;
  } | null>(null);
  const [localData, setLocalData] = useState<{
    userProfile?: any;
    userSettings?: any;
    quizResults?: any;
  } | null>(null);

  const checkLocalData = () => {
    try {
      const userProfile = localStorage.getItem('userProfile');
      const userSettings = localStorage.getItem('userSettings');
      const quizResults = localStorage.getItem('quizResults');

      const data = {
        userProfile: userProfile ? JSON.parse(userProfile) : null,
        userSettings: userSettings ? JSON.parse(userSettings) : null,
        quizResults: quizResults ? JSON.parse(quizResults) : null,
      };

      setLocalData(data);
    } catch (error) {
      console.error("Error reading localStorage:", error);
      setMigrationStatus({
        success: false,
        message: "Error reading local data",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const migrateData = async () => {
    if (!user || !localData) {
      setMigrationStatus({
        success: false,
        message: "No user or local data found"
      });
      return;
    }

    setIsLoading(true);
    setMigrationStatus(null);

    try {
      const result = await ClientDatabaseService.migrateLocalStorageToDatabase(user.uid);
      
      if (result.success) {
        setMigrationStatus({
          success: true,
          message: "Data migration completed successfully! Your data has been moved to the cloud database."
        });

        // Clear localStorage after successful migration
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userSettings');
        localStorage.removeItem('quizResults');
        
        setTimeout(() => {
          window.location.href = '/recommendations';
        }, 3000);
      } else {
        setMigrationStatus({
          success: false,
          message: "Migration failed",
          error: result.error
        });
      }
    } catch (error) {
      console.error("Migration error:", error);
      setMigrationStatus({
        success: false,
        message: "Migration failed with error",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h1>
          <p className="text-gray-600">You need to be logged in to migrate your data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Migration</h1>
            <p className="text-gray-600">
              Migrate your local data to our secure cloud database for better performance and reliability.
            </p>
          </div>

          {!localData && (
            <div className="text-center mb-8">
              <button
                onClick={checkLocalData}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Check Local Data
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Click to scan for data stored in your browser
              </p>
            </div>
          )}

          {localData && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Local Data Found:</h2>
              
              <div className="space-y-3">
                {localData.userProfile && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-800 font-medium">User Profile</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Name: {localData.userProfile.fullName}, Class: {localData.userProfile.currentClass}
                    </p>
                  </div>
                )}

                {localData.userSettings && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-800 font-medium">User Settings</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Notification preferences and app settings
                    </p>
                  </div>
                )}

                {localData.quizResults && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-800 font-medium">Quiz Results</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Aptitude test scores and assessments
                    </p>
                  </div>
                )}

                {!localData.userProfile && !localData.userSettings && !localData.quizResults && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.734 0L3.878 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-yellow-800 font-medium">No Local Data Found</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      No data needs to be migrated. You can start fresh!
                    </p>
                  </div>
                )}
              </div>

              {(localData.userProfile || localData.userSettings || localData.quizResults) && (
                <div className="mt-6 text-center">
                  <button
                    onClick={migrateData}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-5 h-5 mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Migrating Data...
                      </>
                    ) : (
                      "Migrate to Cloud Database"
                    )}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    This will move your data to the cloud and clear local storage
                  </p>
                </div>
              )}
            </div>
          )}

          {migrationStatus && (
            <div className={`p-4 rounded-lg ${migrationStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center">
                {migrationStatus.success ? (
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className={`font-medium ${migrationStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                  {migrationStatus.success ? 'Success!' : 'Error'}
                </span>
              </div>
              <p className={`mt-1 text-sm ${migrationStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                {migrationStatus.message}
                {migrationStatus.error && `: ${migrationStatus.error}`}
              </p>
              {migrationStatus.success && (
                <p className="text-sm text-green-600 mt-2">
                  Redirecting to recommendations page in a few seconds...
                </p>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">What happens during migration?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your profile data is securely transferred to our cloud database</li>
              <li>• Quiz results and settings are preserved</li>
              <li>• Local browser storage is cleaned up</li>
              <li>• You'll have access to your data from any device</li>
              <li>• Better performance and reliability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}