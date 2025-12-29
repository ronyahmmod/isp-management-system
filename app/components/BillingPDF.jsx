// components/BillingPDF.jsx
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#333" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: { width: 80 },
  companyInfo: { textAlign: "right" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1e40af" },

  // Status Stamp Styling
  statusStamp: {
    position: "absolute",
    top: 150,
    right: 50,
    borderWidth: 3,
    borderRadius: 5,
    padding: 8,
    transform: "rotate(-15deg)",
    opacity: 0.7,
  },
  paidStamp: { borderColor: "#16a34a", color: "#16a34a" },
  unpaidStamp: { borderColor: "#dc2626", color: "#dc2626" },

  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    marginTop: 20,
  },
  tableHeader: {
    backgroundColor: "#1e40af",
    flexDirection: "row",
    color: "#fff",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderColor: "#eee",
    minHeight: 25,
    alignItems: "center",
  },
  col: { padding: 6 },

  // Signature Section
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 80,
  },
  signatureBox: {
    width: 180,
    borderTopWidth: 1,
    borderColor: "#333",
    textAlign: "center",
    paddingTop: 5,
  },
  signatureLabel: { fontSize: 9, color: "#666" },
});

const BillingPDF = ({ data }) => {
  const isPaid = data.status?.toLowerCase() === "paid";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* <Image style={styles.logo} src="/logo.png" /> */}
          <View style={styles.companyInfo}>
            <Text style={styles.title}>INVOICE / PAYSLIP</Text>
            <Text>Invoice ID: {data.invoiceId}</Text>
            <Text>Date: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Payment Status Stamp */}
        <View
          style={[
            styles.statusStamp,
            isPaid ? styles.paidStamp : styles.unpaidStamp,
          ]}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {isPaid ? "PAID" : "UNPAID"}
          </Text>
        </View>

        {/* Customer & Billing Info */}
        <View style={styles.infoGrid}>
          <View>
            <Text style={{ color: "#666", marginBottom: 2 }}>
              CUSTOMER DETAILS:
            </Text>
            <Text style={{ fontWeight: "bold" }}>{data.customer?.name}</Text>
            <Text>{data.customer?.address}</Text>
            <Text>Phone: {data.customer?.phone}</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={{ color: "#666", marginBottom: 2 }}>
              BILLING PERIOD:
            </Text>
            <Text style={{ fontWeight: "bold" }}>
              {data.month} {data.year}
            </Text>
            <Text>Method: {data.paymentMethod || "Cash"}</Text>
          </View>
        </View>

        {/* Item Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.col, { flex: 3 }]}>Service Description</Text>
          <Text style={[styles.col, { flex: 1, textAlign: "right" }]}>
            Amount
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.col, { flex: 3 }]}>
            {data.package?.name} Internet Package
          </Text>
          <Text style={[styles.col, { flex: 1, textAlign: "right" }]}>
            {data.amount}
          </Text>
        </View>

        {/* Grand Total */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <View style={{ width: 150, backgroundColor: "#f3f4f6", padding: 8 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>Total:</Text>
              <Text style={{ fontWeight: "bold" }}>{data.amount}</Text>
            </View>
          </View>
        </View>

        {/* NEW: Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 10 }}>{data.customer?.name}</Text>
            <Text style={styles.signatureLabel}>Customer Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 10 }}>
              {data.collectedBy?.name || "Authorized Person"}
            </Text>
            <Text style={styles.signatureLabel}>Receiver Signature</Text>
          </View>
        </View>

        <Text
          style={{
            position: "absolute",
            bottom: 30,
            left: 40,
            color: "#999",
            fontSize: 8,
          }}
        >
          Generated on: {new Date().toLocaleString()} | This is a computer
          generated receipt.
        </Text>
      </Page>
    </Document>
  );
};

export default BillingPDF;
