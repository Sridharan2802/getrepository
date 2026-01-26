public with sharing class AccountPdfController {
    
    @AuraEnabled
    public static Id saveAccountDetailsAsPDF(String htmlContent, Id recordId, String accountName) {
        try {
            // Spring '26 feature to generate PDF from HTML
            Blob pdfBlob = Blob.toPdf(htmlContent);
            
            // Create ContentVersion data
            ContentVersion cv = new ContentVersion();
            cv.Title = accountName + ' - PDF';
            cv.PathOnClient = accountName + '.pdf';
            cv.VersionData = pdfBlob;
            cv.IsMajorVersion = true;
            insert cv;
            
            // Get ContentDocumentId
            Id contentDocumentId = [
                SELECT ContentDocumentId 
                FROM ContentVersion 
                WHERE Id = :cv.Id
            ].ContentDocumentId;
            
            // Link to the record
            ContentDocumentLink cdl = new ContentDocumentLink();
            cdl.ContentDocumentId = contentDocumentId;
            cdl.LinkedEntityId = recordId;
            cdl.ShareType = 'V';
            cdl.Visibility = 'AllUsers';
            insert cdl;
            
            return contentDocumentId;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}