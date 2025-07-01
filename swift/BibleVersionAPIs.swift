import Foundation
import ZipArchive

enum BibleVersionAPIError: Error {
    case cannotDownload
    case invalidDownload
    case notPermitted
    case invalidResponse
}

enum BibleVersionAPIs {
    /// Fetches version metadata from the server
    static func metadata(versionId: Int) async throws -> Data {
        guard let appKey = YouVersionPlatformConfiguration.appKey else {
            preconditionFailure("YouVersionPlatformConfiguration.appKey must be set.")
        }

        guard let url = URLBuilder.versionURL(versionId: versionId) else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.setValue(appKey, forHTTPHeaderField: "apikey")

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            print("metadataFromServer: unexpected response type")
            throw BibleVersionAPIError.invalidResponse
        }

        if httpResponse.statusCode == 401 {
            print("metadataFromServer: 401 Unauthorized (possibly a bad app_key)")
            throw BibleVersionAPIError.notPermitted
        }

        guard httpResponse.statusCode == 200 else {
            print("error \(httpResponse.statusCode) while downloading metadata")
            throw BibleVersionAPIError.cannotDownload
        }

        return data
    }



    /// Finds Bible versions by language code
    static func versions(forLanguageTag languageTag: String? = nil) async throws -> [BibleVersionOverview] {
        guard let appKey = YouVersionPlatformConfiguration.appKey else {
            preconditionFailure("YouVersionPlatformConfiguration.appKey must be set.")
        }

        guard let languageTag, languageTag.count == 3 else {
            print("Invalid language code: \(languageTag ?? "unknown")")
            return []
        }
        
        guard let url = URLBuilder.versionsURL(languageTag: languageTag) else {
            throw URLError(.badURL)
        }

        var request = URLRequest(url: url)
        request.setValue(appKey, forHTTPHeaderField: "apikey")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            print("unexpected response type")
            throw BibleVersionAPIError.invalidResponse
        }

        if httpResponse.statusCode == 401 {
            print("error 401: unauthorized. Check your appKey")
            throw BibleVersionAPIError.notPermitted
        }

        guard httpResponse.statusCode == 200 else {
            print("error in findVersions: \(httpResponse.statusCode)")
            throw BibleVersionAPIError.cannotDownload
        }

        let responseObject = try JSONDecoder().decode(BibleVersionOverviewsResponse.self, from: data)
        return responseObject.versions
    }

    private struct BibleVersionOverviewsResponse: Decodable {
        let versions: [BibleVersionOverview]
    }

}