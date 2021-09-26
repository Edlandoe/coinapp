import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.baseTitle}>CoinRoutes</Text>
      </View>
      <Text> </Text>
      <View>
        <View>
          <Text>Bezier Line Chart</Text>
          <View>
            <Text>Bezier Line Chart</Text>
            <LineChart
              data={{
                labels: ws["generated_timestamp"],
                datasets: [
                  {
                    data: ws["ask_price"],
                  },
                ],
              }}
              width={Dimensions.get("window").width} // from react-native
              height={220}
              yAxisLabel="$"
              yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(23, 40, 69, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(240, 240, 240, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
          <View>
            <PieChart
              data={currency_pairs}
              width={Dimensions.get("window").width}
              height={220}
              //chartConfig={chartConfig}
              accessor={"target_currecy"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 50]}
              absolute
            />
          </View>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

// currency pairs
const currency_pairs = fetch(
  "https://staging.coinroutes.com/api/currency_pairs/",
  {
    method: "GET",
    Mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token 6c634e1eacecc4801b000249287fbf923d5c8824",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
    },
  }
).then((Response) => Response.json());

console.log("Pairs should be here: ", currency_pairs);

// cost calculator API
const cost_Calculator = fetch(
  "https://staging.coinroutes.com/api/cost_calculator/",
  {
    method: "POST",
    Mode: "cors",
    body: {
      currency_pair: "BTC-USD",
      exchanges: ["gdax", "gemini", "bitstamp"],
      side: "bids",
      quantity: 1,
      use_fees: true,
      use_funding_currency: false,
    },
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token 6c634e1eacecc4801b000249287fbf923d5c8824",
      "User-Agent":
        " Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
    },
  }
).then((Response) => Response.json());

// Real Price API
const ws = new WebSocket(
  "wss://staging.coinroutes.com/api/streaming/cbbo/?token=6c634e1eacecc4801b000249287fbf923d5c8824",
  []
);
ws.onopen = () => {
  let requestMessage = {
    currency_pair: "BTC-USD",
    size_filter: 0,
    sample: 0.5,
  };
  ws.send(JSON.stringify(requestMessage));
};

// CBBO API
const CBBO = fetch(
  "https://staging.coinroutes.com/api/streaming/cbbo/?token=6c634e1eacecc4801b000249287fbf923d5c8824",
  {
    method: "GET",
    Mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token 6c634e1eacecc4801b000249287fbf923d5c8824",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
    },
  }
).then((Response) => Response.json());

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09111F",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: "80%",
    position: "absolute",
    backgroundColor: "#162442",
  },
  baseTitle: {
    color: "#FFFFFF",
  },
  box1: {
    alignItems: "center",
    borderRadius: "15px",
    backgroundColor: "#172845",
  },
  box2: {
    position: "absolute",
    width: "20%",
    height: "460px",
    left: "-5px",
    top: "104px",
    backgroundColor: "#172845",
    borderRadius: "15px",
  },
});
