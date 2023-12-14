import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.net.HttpURLConnection;
import java.net.URL;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;

public class XmlScraper {

    public static void main(String[] args) {
        try {
            // Define the URL we want to load data from.
            String urlString = "https://www.lcsd.gov.hk/datagovhk/event/venues.xml";
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            // Set the request to GET as we are fetching data.
            conn.setRequestMethod("GET");
            
            // Check for successful response code or throw error.
            if (conn.getResponseCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
            }
            
            // Use the XML DOM Parser to parse the response.
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(conn.getInputStream());
            
            // Optional but recommended
            doc.getDocumentElement().normalize();
            
            NodeList nList = doc.getElementsByTagName("venue id");
            
            System.out.println("Parsing elements...");
            
            for (int temp = 0; temp < nList.getLength(); temp++) {
                Node nNode = nList.item(temp);
                
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    System.out.println("venue id : " + eElement.getElementsByTagName("venuee").item(0).getTextContent());
                }
            }
            
            conn.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

    