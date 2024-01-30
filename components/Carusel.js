import React, { Component } from 'react';
import { Image, ImageBackground, SafeAreaView, Text, View, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  carouselContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  itemContainer: {
    backgroundColor: 'white',
    marginLeft: 25,
  },
  image: {
    height: 100,
    width: '100%',
  },
});

export class Carusel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      carouselItems: [
        {
          title: 'Item 1',
          text: 'Text 1',
          img: 'https://dmart.onrender.com/images/d1.jpg',
        },
        {
          title: 'Item 2',
          text: 'Text 2',
          img: 'https://dmart.onrender.com/images/d2.jpg',
        },
        {
          title: 'Item 3',
          text: 'Text 3',
          img: 'https://dmart.onrender.com/images/d3.jpg',
        },
      ],
    };
  }

  _renderItem({ item, index }) {
    return (
      <View style={styles.itemContainer}>
        <ImageBackground source={{ uri: item.img }} style={styles.image} />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.carouselContainer}>
          <Carousel
            layout={'default'}
            ref={(ref) => (this.carousel = ref)}
            data={this.state.carouselItems}
            sliderWidth={300}
            itemWidth={300}
            renderItem={this._renderItem}
            onSnapToItem={(index) => this.setState({ activeIndex: index })}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default Carusel;
